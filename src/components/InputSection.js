import React, { createContext, useContext, useState } from "react";
import { AppContext } from "./AppContext";

const InputSection = () => {
  const {
    value,
    setValue,
    message,
    setMessage,
    getMessages,
    ccGetMessages,
    handleKeyDown,
    ccHandleKeyDown,
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
    handleBlur,
    handleThemeChange,
    handlePromptChange,
    handleUserPromptChange,
    handleSystemPromptChange,
    handleSystemPrompt1Change,
    handleSystemPrompt2Change,
    handleOpenModal,
    handleCloseModal,
    handleOpenPromptModal,
    handleClosePromptModal,
    handleDeleteMessage,
  } = useContext(AppContext);

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
          value={value}
          onChange={handleUserPromptChange}
          onKeyDown={handleKeyDown}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{ height: "20px", overflowY: "auto" }}
          ref={userPromptRef}
        />
        <p>Token Estimate: {userPromptCharCount}</p>
        <button id="submit" onClick={getMessages}>
          SEND➢
        </button>
      </div>

      <p className="info">Beta v.1 (desktop only)</p>
    </div>
  );
};

export default InputSection;
