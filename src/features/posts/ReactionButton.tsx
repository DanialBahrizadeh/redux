import { useDispatch } from "react-redux";
import { AppDispatch } from "../../app/store";
import { addReaction, Post, Reaction } from "./postsSlice";

type ReactionButtonProps = {
  post: Post;
};

const ReactionButton: React.FC<ReactionButtonProps> = ({ post }) => {
  const reactionEmoji = {
    thumbsUp: "👍",
    wow: "😮",
    heart: "❤️",
    rocket: "🚀",
    coffee: "☕",
  };
  const dispatch = useDispatch<AppDispatch>();

  const reactionButtons = Object.entries(reactionEmoji).map(([name, emoji]) => {
    return (
      <button
        key={name}
        type="button"
        className="reactionButton"
        onClick={() =>
          dispatch(addReaction({ postId: post.id, reaction: name as Reaction }))
        }
      >
        {emoji} {post.reactions[name as Reaction]}
      </button>
    );
  });

  return <div>{reactionButtons}</div>;
};
export default ReactionButton;
