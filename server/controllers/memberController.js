import Member from '../models/Member.js';
import Transaction from '../models/Transaction.js';
import { asyncHandler } from '../middleware/errorHandler.js';

export const getMembers = asyncHandler(async (req, res) => {
  const { search } = req.query;
  const filter = search
    ? {
        $or: [
          { name: new RegExp(search, 'i') },
          { email: new RegExp(search, 'i') },
          { phone: new RegExp(search, 'i') }
        ]
      }
    : {};
  const members = await Member.find(filter).sort({ createdAt: -1 });
  res.json(members);
});

export const getMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return res.status(404).json({ message: 'Member not found' });
  res.json(member);
});

export const createMember = asyncHandler(async (req, res) => {
  const { name, email, phone, membershipDate } = req.body;
  const member = await Member.create({ name, email, phone, membershipDate });
  res.status(201).json(member);
});

export const updateMember = asyncHandler(async (req, res) => {
  const member = await Member.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!member) return res.status(404).json({ message: 'Member not found' });
  res.json(member);
});

export const deleteMember = asyncHandler(async (req, res) => {
  const member = await Member.findById(req.params.id);
  if (!member) return res.status(404).json({ message: 'Member not found' });

  const activeIssues = await Transaction.countDocuments({
    memberId: member._id,
    status: 'issued'
  });
  if (activeIssues > 0) {
    return res
      .status(400)
      .json({ message: 'Cannot delete a member with issued books' });
  }

  await member.deleteOne();
  res.json({ message: 'Member deleted' });
});
