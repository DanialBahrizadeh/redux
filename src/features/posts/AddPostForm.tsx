import { ChangeEvent, FormEvent, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch } from "../../app/store";
import { addPost, Status } from "./postsSlice";
import { addNewPost } from "./postsSlice";
import { selectAllUsers } from "../users/usersSlice";
const AddPostForm: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const defaultPostValue = () => ({
    userId: "",
    title: "",
    body: "",
  });
  const [post, setPost] = useState(() => defaultPostValue());
  const users = useSelector(selectAllUsers);
  const [addRequestStatus, setAddRequestStatus] = useState<Status>("idle");
  const onUserIdChange = (event: ChangeEvent<HTMLSelectElement>) =>
    setPost((prevPost) => ({ ...prevPost, userId: event.target.value }));
  const usersptions = users.map((user) => (
    <option key={user.id} value={user.id}>
      {user.name}
    </option>
  ));

  const handleChange = ({
    target,
  }: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setPost((prevPost) => ({
      ...prevPost,
      [target.name]: target.value,
    }));
  };

  const validation =
    [post.title, post.title, post.body].every(Boolean) &&
    addRequestStatus === "idle";

  const onSavePost = () => {
    if (validation) {
      try {
        setAddRequestStatus("loading");
        const { title, body } = post;
        const userId = Number(post.userId);
        dispatch(addNewPost({ title, body, userId })).unwrap();

        setPost(() => defaultPostValue());
      } catch (error) {
        console.error("Failed to save the post", error);
      } finally {
        setAddRequestStatus("idle");
      }
    }
  };

  const handleSubmit = (event: FormEvent) => {
    event.preventDefault();
  };

  return (
    <section>
      <h2>Add a New Post</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="postTitle">Post Title</label>
        <input
          type="text"
          id="postTitle"
          placeholder="title"
          name="title"
          value={post.title}
          onChange={handleChange}
        />
        <label htmlFor="postAuthor">Author:</label>
        <select id="postAuthor" value={post.userId} onChange={onUserIdChange}>
          <option value="">SelectOne</option>
          {usersptions}
        </select>
        <label htmlFor="postContent">Content:</label>
        <textarea
          name="body"
          id="postContent"
          placeholder="Content"
          value={post.body}
          onChange={handleChange}
        ></textarea>
        <button type="submit" disabled={!validation} onClick={onSavePost}>
          Save Post
        </button>
      </form>
    </section>
  );
};
export default AddPostForm;
