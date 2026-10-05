import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Contact({ listing }) {
  const [contactLord, setContactLord] = useState(null);
  const [message, setMessage] = useState("");

  const onChange = (e) => {
    setMessage(e.target.value);
  };

  useEffect(() => {
    const fetchContact = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5000/api/user/${listing.userRef}`,
          {
            withCredentials: true,
          },
        );

        const data = res.data;
        setContactLord(data);
      } catch (error) {
        console.log(error);
      }
    };

    if (listing?.userRef) {
      fetchContact();
    }
  }, [listing?.userRef]);

  return (
    <>
      {contactLord && (
        <>
          <div>
            <p>
              Contact <span>{contactLord.username}</span> for{" "}
              <span>{listing.name.toLowerCase()}</span>
            </p>
          </div>

          <textarea
            name="message"
            id="message"
            rows="2"
            value={message}
            onChange={onChange}
            placeholder="Enter your message here..."
            className="w-full border p-3 rounded-lg"
          />

          <Link
            to={`mailto:${contactLord.email}?subject=Regarding ${listing.name}&body=${message}`}
            className="bg-slate-700 text-white text-center p-3 uppercase rounded-lg hover:opacity-95"
          >
            Send Message
          </Link>
        </>
      )}
    </>
  );
}

export default Contact;
