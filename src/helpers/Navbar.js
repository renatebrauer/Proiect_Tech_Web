import React, { useEffect, useState } from "react";
import AddNote from "../components/AddNote/AddNote";
import DemoPage from "../components/DemoPage/DemoPage";
import ActionButton from "./ActionButton";
import "./Navbar.css";
import NavPage from "./NavPage";
import axios from "axios";
import NotebookWrapper from "../components/NotebookWrapper/NotebookWrapper";

const Navbar = () => {
  const [op_list, setList] = useState();
  const [gr_list, setGroup] = useState();

  const NAV_DATA = [
    {
      id: 0,
      pageName: "Notebook",
      tagStyle: "accounts",
      isDropdown: true,
      list: op_list,
    },
    {
      id: 1,
      pageName: "Groups",
      tagStyle: "groups",
      isDropdown: true,
      list: gr_list,
    }
  ];

  const [userData] = useState(JSON.parse(localStorage.getItem("user")));
  const [trigger, setTrigger] = useState();
  const [clickId, setId] = useState();
  const [content, setContent] = useState(<DemoPage />);
  const [isHidden, setHidden] = useState(true);
  const [activeNb, setNb] = useState();

  useEffect(() => {
    axios.get("/notes/user/" + userData.data.email).then((resp) => {
      var org = [];
      for(let i = 0; i < resp.data.length; i++){
        if (!org.find(x => x.title === resp.data[i].notebook)) {
          org.push({
            title: resp.data[i].notebook,
            content: [resp.data[i]],
            isNotebook : true
          });
        } else {
          org.find(x => x.title === resp.data[i].notebook).content = [
            ...org.find(x => x.title === resp.data[i].notebook).content,
            resp.data[i],
          ];
        }
      }
      console.log(org);
      setList(org);
    });
    console.log(op_list);
  }, [trigger]);

  useEffect(() => {
    axios.get("/groups").then((resp) => {      
      const dummyNotes = resp.data.map((item) => {  
        
        if(item.users !== null) {
          let useri = item.users.split(',');
          for(var i = 0; i < useri.length; i++) {
            if( useri[i] === userData.data.email ) {
              return {
                title: item.name,
                content: item.users                
              }
            }
          }
        }
        return {}
      
      })
      setGroup(dummyNotes);
    });
    console.log(gr_list);
  }, [trigger]);

  return (
    <div className="pageContainer">
      <div className="fullHeight">
        <div className="navContainer">
          <div className="navGroup">
            <div className="accountContainer">
              <div className="navInfo">
                <div className="profilePic">
                  <img src={userData.data.picture} />
                </div>
                <div className="navUser">{userData.data.name}</div>
              </div>
            </div>
            <div
              className="addNotebook"
              onClick={() => setContent(<AddNote note={{ title: "", content: "a", notebook: ""}}/>)}
            >
              <ActionButton text="Add Note" />
            </div>
            <div className="navPages">
              {NAV_DATA.map((item, index) => {
                return (
                  <NavPage
                    pageName={item.pageName}
                    tagID={item.tagID}
                    id={item.id}
                    key={item.id}
                    setId={setId}
                    clickId={clickId}
                    isDropdown={item.isDropdown}
                    list={item.list}
                    setContent={setContent}
                    setHidden={setHidden}
                    isHidden={isHidden}
                    setNb={setNb}
                 
                  />
                );
              })}
            </div>
            <div className="navLogo">
              <div className="logo" />
            </div>
          </div>
        </div>
      </div>
      <div className="contentContainer">{<NotebookWrapper setContent={setContent} content={content} isHidden={isHidden} nbList={activeNb}/>}</div>
    </div>
  );
};

export default Navbar;
