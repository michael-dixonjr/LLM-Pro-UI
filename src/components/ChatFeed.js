import React, { createContext, useContext, useState } from "react";
import { AppContext } from "./AppContext";


const ChatFeed = () => {
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
      handleDeleteMessage
    } = useContext(AppContext);


    return (
        <ul className="feed" id="chatfeed">
          {chatHistory.map((chatMessage, index) => (
            <li
              key={index}
              id={chatMessage.role === "system" ? "ai-message" : ""}
            >
              <div
                className={
                  chatMessage.role === "system" ? "ai-title-bar" : "title-bar"
                }
              >
                <p className="role">
                  {mapRoleToDisplay(chatMessage.role)}
                  <button
                    className={
                      chatMessage.role === "system"
                        ? "ai-audio-button"
                        : "audio-button"
                    }
                    onClick={() => convertTextToSpeech(chatMessage.content)}
                  >
                    {playingAudio ? "⏹" : "⏵"}
                  </button>
                  <button
                    className={
                      chatMessage.role === "system"
                        ? "ai-delete-button"
                        : "delete-button"
                    }
                    onClick={() => handleDeleteMessage(index)}
                  >
                    🗑
                  </button>
                </p>
              </div>
              <ReactMarkdown components={components} className="react-markdown">
                {chatMessage.content}
              </ReactMarkdown>
            </li>
          ))}
          {isLoading && (
            <div className="loading-container">
              <p className="loading-message">Generating response...</p>
            </div>
          )}
        </ul>
    );
};

export default ChatFeed;