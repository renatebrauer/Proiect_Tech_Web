import React, { useCallback, useEffect, useRef, useState } from "react";
import ActionButton from "../../helpers/ActionButton";
import Input from "../../helpers/Input";
import "./AddNote.css";
import axios from "axios";
import { useHistory } from "react-router-dom";
import MDEditor from "@uiw/react-md-editor";

const AddNote = (props) => {
  const {
    edit = false,
    note = { title: "Draft", content: "a", notebook: "" },
    noteId = "",
    init
  } = props;
  const redirect = useHistory();
  const [value, setValue] = useState(note.content);
  const [request, setRequest] = useState({
    title: note.title,
    content: "Draft",
    public: true,
    notebook: "",
  });

  let userEmail = JSON.parse(localStorage.getItem("user"));
  userEmail = userEmail.data.email;
  console.log(userEmail);
  const [id, setId] = useState(noteId);
  const clickRef = useRef();
  const [clicked, setClicked] = useState(true);
  console.log("INFO", id, note, value);

  const handleValue = (value, field) => {
    if (field === "title") {
      setRequest({
        title: value,
        content: request.content,
        public: request.public,
        notebook: request.notebook,
      });
    } else if (field === "content") {
      setRequest({
        title: request.title,
        content: value,
        public: request.public,
        notebook: request.notebook,
      });
    } else if (field === "notebook") {
      setRequest({
        title: request.title,
        content: request.content,
        public: request.public,
        notebook: value,
      });
    }
  };

  const handleCreate = useCallback(() => {
    axios.put("/notes" + id, request).then(
      (response) => {
        console.log(response);
      },
      (error) => {
        console.log(error);
      }
    );
  }, [id, request, value]);

  const handleEdit = () => {
    axios.get("/notes/user/" + userEmail).then((resp) => {
      let currentId;
      if (edit) currentId = noteId;
      else  currentId = "/" + resp.data[resp.data.length - 1].id;
      setId(currentId);
      console.log(currentId);
    });
  };

  useEffect(() => {
    if (!edit) {
      axios.post("/notes/user/" + userEmail, request).then(
        (response) => {
          console.log(response);
          handleEdit();
        },
        (error) => {
          console.log(error);
        }
      );
    }else {
      handleEdit()
      console.log(init)
    }
  }, [init]);

  useEffect(() => {
    console.log(value);
    if (true) {
      handleValue(value, "content");
    }
  }, [value]);

  useEffect(() => {
    const handleSave = () => {
      console.log("HERE ----------", request);

      handleEdit();
      handleCreate();
    };
    if (request.content !== "Draft") handleSave();
  }, [request]);

  const handleClick = (e) => {
    if (!clickRef.current.contains(e.target)) {
      setClicked(false);
    } else {
      setClicked(true);
    }
  };

  useEffect(() => {
    window.addEventListener("click", handleClick);
    return () => {
      window.removeEventListener("click", handleClick);
    };
  });

  return (
    <div ref={clickRef} className="noteContainer">
      <Input
        type="text"
        defaultValue={note.title ? note.title: "Title"}
        handleValue={handleValue}
        field="title"
      
      />
      {clicked ? (
        <MDEditor
          preview="edit"
          height="90vh"
          onChange={setValue}
          value={value}
        />
      ) : (
        <MDEditor
          preview="preview"
          height="90vh"
          onChange={setValue}
          value={value}
        />
      )}
      <Input
        type="input"
        defaultValue={note.notebook ? note.notebook: "Notebook"}
        handleValue={handleValue}
        field="notebook"
        
      />
    </div>
  );
};

export default AddNote;
