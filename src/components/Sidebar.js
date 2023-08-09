import React, { createContext, useContext, useState } from "react";
import { AppContext } from "./AppContext";
import { themes } from "./themes";
import { useTheme } from "./themeContext";
import { systemPrompts } from "./AppContext";

const Sidebar = () => {
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

  const { theme, setTheme } = useTheme();

  return (
    <section
      className="side-bar"
      style={{ width: isSidebarCollapsed ? "0" : "244px" }}
    >
      <button
        className="toggle-sidebar"
        onClick={toggleSidebar}
        style={{ left: isSidebarCollapsed ? "0" : "190px" }}
      >
        {isSidebarCollapsed ? ">>" : "<<"}
      </button>
      <button
        onClick={createNewChat}
        className={isSidebarCollapsed ? "hidden" : ""}
      >
        Refresh Chat
      </button>
      <button
        onClick={() => window.print()}
        className={isSidebarCollapsed ? "hidden" : ""}
      >
        Export to PDF
      </button>
      <button
        onClick={handleStandardButtonClick}
        className={isSidebarCollapsed ? "hidden" : ""}
      >
        Standard
      </button>
      <button
        onClick={handleccButtonClick}
        className={isSidebarCollapsed ? "hidden" : ""}
      >
        Conference Call
      </button>

      <ul className={`history ${isSidebarCollapsed ? "hidden" : ""}`}></ul>
      <div className={`settings ${isSidebarCollapsed ? "hidden" : ""}`}>
        <div className="model-selection">
          <label htmlFor="model">Model:</label>
          <div>
            <ModelButton
              model="gpt-4"
              displayName="GPT 4"
              currentModel={model}
              onClick={(selectedModel) => setModel(selectedModel)}
            />
            <ModelButton
              model="gpt-3.5-turbo"
              displayName="GPT 3.5T"
              currentModel={model}
              onClick={(selectedModel) => setModel(selectedModel)}
            />
            <ModelButton
              model="gpt-3.5-turbo-16k"
              displayName="GPT 3.5 16k"
              currentModel={model}
              onClick={(selectedModel) => setModel(selectedModel)}
            />
          </div>
        </div>
        <div className="prompt-selection">
          <label htmlFor="system-prompt">System Prompt:</label>
          <button onClick={handleOpenPromptModal}>System Prompts</button>
        </div>
        <div className="slider-container">
          <label htmlFor="temperature">Temperature:</label>
          <input
            className="sliders"
            type="range"
            id="temperature"
            min="0.1"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
          />
          <input
            type="number"
            min="0.1"
            max="1"
            step="0.1"
            value={temperature}
            onChange={(e) => setTemperature(parseFloat(e.target.value))}
          />
        </div>
        <div className="slider-container">
          <label htmlFor="max-tokens">Max Tokens:</label>
          <input
            className="sliders"
            type="range"
            id="max-tokens"
            min="100"
            max={
              model === "gpt-3.5-turbo"
                ? "2000"
                : model === "gpt-3.5-turbo-16k"
                ? "16000"
                : "8000"
            }
            step="100"
            value={baseMaxTokens}
            onChange={(e) => setBaseMaxTokens(parseInt(e.target.value))}
          />
          <input
            type="number"
            min="100"
            max={
              model === "gpt-3.5-turbo"
                ? "2000"
                : model === "gpt-3.5-turbo-16k"
                ? "16000"
                : "8000"
            }
            step="100"
            value={baseMaxTokens}
            onChange={(e) => setBaseMaxTokens(parseInt(e.target.value))}
          />
        </div>

        <div className="remaining-tokens">
          Remaining Tokens: {remainingTokens}
        </div>
        <button onClick={handleOpenModal}>Themes</button>
      </div>
      <dialog open={isModalOpen} onClose={handleCloseModal}>
        <h2>Select a theme</h2>
        {Object.keys(themes).map((themeName) => (
          <button key={themeName} onClick={() => handleThemeChange(themeName)}>
            {themeName}
          </button>
        ))}
        <button onClick={handleCloseModal}>Close</button>
      </dialog>
      <dialog
        id="promptDialog"
        open={isPromptModalOpen}
        onClose={handleClosePromptModal}
      >
        {systemPrompts.map((promptObj) => (
          <button
            key={promptObj.name}
            onClick={() => handlePromptChange(promptObj.prompt)}
          >
            {promptObj.name}
          </button>
        ))}
        <button onClick={handleClosePromptModal}>Close</button>
      </dialog>

      <nav className={isSidebarCollapsed ? "hidden" : ""}>
        <p>Beta v.1 (desktop only)</p>
      </nav>
    </section>
  );
};

export default Sidebar;