import React, { createContext, useContext, useState } from "react";
import { AppContext } from "./AppContext";

const InputSection = () => {
  const {
    userPrompt,
    setUserPrompt,
    message,
    setMessage,
    getMessages,
    //handleKeyDown,
    parseMessage,
    components,
    ReactMarkdown,
    convertTextToSpeech,
    chatHistory,
    setChatHistory,
    systemPrompt,
    setSystemPrompt,
    systemPrompt1,
    setSystemPrompt1,
    systemPrompt2,
    setSystemPrompt2,
    temperature,
    setTemperature,
    model,
    setModel,
    toggleSidebar,
    isSidebarCollapsed,
    setIsSidebarCollapsed,
    systemPromptCharCount,
    setSystemPromptCharCount,
    userPromptCharCount,
    setUserPromptCharCount,
    baseMaxTokens,
    setBaseMaxTokens,
    totalTokensUsed,
    setTotalTokensUsed,
    estimateTokenCount,
    remainingTokens,
    playingAudio,
    setPlayingAudio,
    isLoading,
    setIsLoading,
    userPromptRef,
    isModalOpen,
    setIsModalOpen,
    isPromptModalOpen,
    setIsPromptModalOpen,
    ModelButton,
    mapRoleToDisplay,
    useEffect,
    ccInputSection,
    createNewChat,
    handleccButtonClick,
    handleStandardButtonClick,
    handleFocus,
    //handleBlur,
    handleThemeChange,
    handlePromptChange,
    //handleUserPromptChange,
    handleSystemPromptChange,
    handleSystemPrompt1Change,
    handleSystemPrompt2Change,
    handleOpenModal,
    handleCloseModal,
    handleOpenPromptModal,
    handleClosePromptModal,
    handleDeleteMessage,
  } = useContext(AppContext);

    // Step 1: Create a local state
    const [localUserPrompt, setLocalUserPrompt] = useState("");
    const [typingTimeout, setTypingTimeout] = useState(null);


    // Step 2: Update the local state on every keystroke
    const handleUserPromptChange = (e) => {
      setLocalUserPrompt(e.target.value);
    
      if(typingTimeout) {
        clearTimeout(typingTimeout);
      }
    
      setTypingTimeout(setTimeout(() => {
        setUserPromptCharCount(Math.ceil(e.target.value.length / 3));
      }, 1000));//may have to set this way lower if it causes issues with not sending exact token amount in time to buffer models who cant go over the limit
    };

    useEffect(() => {
      return () => {
        clearTimeout(typingTimeout);
      }
    }, []);
  
    // Step 3: Submit the local state to the context when done
    const handleSubmit = () => {
      setUserPrompt(localUserPrompt);
    };

    useEffect(() => {
      if (userPrompt !== "") {
        getMessages();
      }
    }, [userPrompt]);

    useEffect(() => {
      setLocalUserPrompt("");
    }, [chatHistory]);
  
    const handleKeyDown = (event) => {
      if (event.key === "Enter" && !event.shiftKey) {
        event.preventDefault();
        handleSubmit();
      }
    };
  
    const handleBlur = () => {
      setUserPromptCharCount(Math.ceil(localUserPrompt.length / 3));
      userPromptRef.current.style.height = '20px'; // Resize the textarea
    };


  return (
    <div className="bottom-section">
      <div className="input-container">
        <label htmlFor="system-prompt">System Prompt:</label>
        <textarea
          id="system-prompt"
          value={systemPrompt}
          onChange={handleSystemPromptChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          disabled={ccInputSection}
          style={{ height: "20px", overflowY: "auto" }}
        />

        <p>
          Token Estimate: {systemPromptCharCount}
        </p>
      </div>
      <div className="input-container">
        <label htmlFor="submit">User Prompt:</label>
        <textarea
          id="user-prompt"
          value={localUserPrompt}
          onChange={handleUserPromptChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{ height: "20px", overflowY: "auto" }}
          ref={userPromptRef}
        />
        <p>Token Estimate: {userPromptCharCount}</p>
        <button id="submit" onClick={() => handleSubmit()}>
          SEND➢
        </button>
      </div>

      <p className="info">Beta v.1</p>
    </div>
  );
};

export default InputSection;
