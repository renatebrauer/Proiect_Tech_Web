import React from "react";
import NbItem from "../../helpers/NbItem";
import "./NotebookWrapper.css"

const NotebookWrapper = (props) => {
  const { setContent, content, isHidden, nbList = [] } = props;
  return (
    <div className="pageContainer">
      <div className="fullHeight" id={isHidden ? "hideNav" : "secondNav"}>
        <div className="navContainer">
          <div className="notebookContainer">
            <div className="nbTitle">Notebooks</div>
            <div className="nbItems">
              {nbList.map((item) => {
                return (
                  <div className="nbItem">
                    <NbItem note={item} setContent={setContent} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
      <div className="contentContainer" id={isHidden ? "marginSet" : ""}>
        {content}
      </div>
    </div>
  );
};

export default NotebookWrapper;
