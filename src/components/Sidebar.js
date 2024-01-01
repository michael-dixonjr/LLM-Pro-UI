import React, { createContext, useContext, useState } from "react";
import { AppContext } from "./AppContext";
import { themes } from "./themes";
import { useTheme } from "./themeContext";
import { systemPrompts } from "./AppContext";
import SaveConvo from "./SaveConvo";

const Sidebar = () => {
  // debugging artifact console.log('Rendering Sidebar');
  const {
    value,
    setValue,
    message,
    setMessage,
    getMessages,
    handleKeyDown,
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
    //stuff for login and register modal
    isLoginModalOpen,
    setIsLoginModalOpen,
    isRegisterModalOpen,
    setIsRegisterModalOpen,
    // stuff for save and retrieve convo
    isSaveDialogOpen,
    setIsSaveDialogOpen,
    ModelButton,
    mapRoleToDisplay,
    useEffect,
    ccInputSection,
    handleClearChat,
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
    // stuff for login and register modal
    user,
    setUser,
    handleOpenLoginModal,
    handleCloseLoginModal,
    handleOpenRegisterModal,
    handleCloseRegisterModal,
    // stuff for save and retreive convo
    handleOpenSaveDialog,
    handleCloseSaveDialog,
    handleDeleteMessage,
    handleLogout,
  } = useContext(AppContext);

  const { theme, setTheme } = useTheme();

  return (
    <section
      className="side-bar"
      style={{
        width: isSidebarCollapsed ? "0" : "244px",
        borderRight: isSidebarCollapsed ? "none" : "",
      }}
    >
      <button
        onClick={toggleSidebar}
        className={isSidebarCollapsed ? "hidden" : ""}
      >
        Close X
      </button>
      <button
        onClick={handleClearChat}
        className={isSidebarCollapsed ? "hidden" : ""}
      >
        Clear Chat
      </button>
      <button
        onClick={() => window.print()}
        className={isSidebarCollapsed ? "hidden" : ""}
      >
        Export to PDF
      </button>
      <button
        onClick={handleOpenSaveDialog}
        className={isSidebarCollapsed ? "hidden" : ""}
      >
        Save Conversation
      </button>
      <dialog
        id="saveDialog"
        open={isSaveDialogOpen}
        onClose={handleCloseSaveDialog}
      >
        <SaveConvo />
      </dialog>
      <button
        onClick={() =>
          window.open(
            "https://github.com/michael-dixonjr/LLM-Pro-UI/blob/main/README.md",
            "_blank"
          )
        }
        className={isSidebarCollapsed ? "hidden" : ""}
      >
        About
      </button>
      <button
        onClick={handleStandardButtonClick}
        className={`${isSidebarCollapsed ? "hidden" : ""} ${
          !ccInputSection ? "active-button" : ""
        }`}
      >
        Standard
      </button>
      <button
        onClick={handleccButtonClick}
        className={`${isSidebarCollapsed ? "hidden" : ""} ${
          ccInputSection ? "active-button" : ""
        }`}
      >
        Conference Call
      </button>

      <ul className={`history ${isSidebarCollapsed ? "hidden" : ""}`}></ul>
      <div className={`settings ${isSidebarCollapsed ? "hidden" : ""}`}>
        <div className="model-selection">
          <label htmlFor="model">Model:</label>
          <div>
            <ModelButton
              model="gpt-4-1106-preview"
              displayName="GPT4-Turbo"
              currentModel={model}
              onClick={(selectedModel) => setModel(selectedModel)}
            />
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
                : model === "gpt-4"
                ? "8000"
                : model === "gpt-4-1106-preview"
                ? "128000"
                : "4000"
            }
            step="100"
            value={baseMaxTokens}
            onChange={(e) => setBaseMaxTokens(parseInt(e.target.value))}
            disabled={baseMaxTokens === 128000}
          />
          <input
            type="number"
            min="100"
            max={
              model === "gpt-3.5-turbo"
                ? "2000"
                : model === "gpt-3.5-turbo-16k"
                ? "16000"
                : model === "gpt-4"
                ? "8000"
                : model === "gpt-4-1106-preview"
                ? "128000"
                : "4000"
            }
            step="100"
            value={baseMaxTokens}
            onChange={(e) => setBaseMaxTokens(parseInt(e.target.value))}
            disabled={baseMaxTokens === 128000}
          />
        </div>

        <div className="remaining-tokens">
          Remaining Tokens: {remainingTokens}
        </div>
        <button onClick={handleOpenModal}>Themes</button>
      </div>
      <dialog id="themeDialog" open={isModalOpen} onClose={handleCloseModal}>
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

      <div className={isSidebarCollapsed ? "hidden" : ""}>
        <p>Beta v.1</p>
      </div>
    </section>
  );
};

export default Sidebar;
