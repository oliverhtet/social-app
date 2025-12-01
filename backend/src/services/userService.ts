import User from "../models/User";
import Post from "../models/Post";
import { Types } from "mongoose";

export const getUserProfile = async (userId: string) => {
  const user = await User.findById(userId);

  if (!user) throw new Error("User not found");

  // Count of posts by the user
  const postCount = await Post.countDocuments({ user: userId });

  // Total likes received by user's posts
  const reactionCountResult = await Post.aggregate([
    { $match: { user: new Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalLikes: {
          $sum: {
            $size: {
              $ifNull: [
                { $cond: [{ $isArray: "$likes" }, "$likes", []] },
                []
              ]
            }
          }
        }
      }
    }
  ]);

  // Total comments on user's posts
  const commentCountResult = await Post.aggregate([
    { $match: { user: new Types.ObjectId(userId) } },
    {
      $group: {
        _id: null,
        totalComments: {
          $sum: {
            $size: {
              $ifNull: [
                { $cond: [{ $isArray: "$comments" }, "$comments", []] },
                []
              ]
            }
          }
        }
      }
    }
  ]);

  return {
    id: user._id,
    name: user.name,
    createdAt: user.createdAt,
    email: user.email,
    profilePic: user.profilePic,
    postCount: postCount || 0,
    reactionCount: reactionCountResult[0]?.totalLikes || 0,
    commentCount: commentCountResult[0]?.totalComments || 0,
  };
};
