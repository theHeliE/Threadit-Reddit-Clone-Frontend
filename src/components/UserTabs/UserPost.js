import React, { useEffect, useState } from "react";
import PostContainer from "../PostContainer";
import PropTypes from "prop-types";
import Cookies from "js-cookie";
import axios from "axios";
import UserPostContainer from "./UserPostContainer";
import MyPostsCont from "./MyPostsCont";

function PostFeed() {
  const [posts, setPosts] = useState([]);
  const [noPosts, setNoPosts] = useState(false); // State to track if there are no posts
  const [mappedDataLength, setMappedDataLength] = useState(0); // State to store the length of mappedData
  const username = localStorage.getItem("username");

  useEffect(() => {
    const token = Cookies.get("token");

    const config = {
      headers: { Authorization: `Bearer ${token}` },
    };

    axios
      .get(`http://localhost:8000/api/v1/users/${username}/posts`, config)
      .then((response) => {
        const mappedData = response.data.data.posts
          .map((item) => {
            if (item._id) {
              return {
                id: item._id,
                title: item.title,
                content: item.text_body,
                time: item.postedTime,
                votes: item.votes,
                numviews: item.numViews,
                spoiler: item.spoiler,
                nsfw: item.nsfw,
                locked: item.locked,
                type: item.type,
                approved: item.approved,
                mentioned: item.mentioned,
                username: item.userID.username,
                commentsCount: item.commentsCount,
                image: item.image,
                Link: item.url,
                video: item.video,
              };
            } else {
              return null;
            }
          })
          .filter(Boolean);

        // Set the length of mappedData
        setMappedDataLength(mappedData.length);

        if (mappedData.length === 0) {
          setNoPosts(true); // Set noPosts state to true if there are no posts
        }

        setPosts(mappedData.reverse());
      })
      .catch((error) => {
        console.error("Error:", error);
        setNoPosts(true); // Set noPosts state to true if there's an error
      });
  }, []);

  return (
    <div className="post-feed">
      {/* Check if noPosts is true and render the appropriate message */}
      {noPosts ? (
        <h1 className="deleted-post">u/{username} hasn't posted yet</h1>
      ) : (
        // Render the posts
        posts.map((post, index) => {
          console.log("Post data:", post); // Log the post data here
          return <MyPostsCont key={index} postData={post} />;
        })
      )}
    </div>
  );
}

export default PostFeed;

PostFeed.propTypes = {
  postData: PropTypes.array,
};
