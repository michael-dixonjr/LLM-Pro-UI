import React, { useState, useEffect, useRef, useContext } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { synthwave84 } from "react-syntax-highlighter/dist/esm/styles/prism";
import { useTheme } from "./components/themeContext";
import { themes } from "./components/themes";
import {
  AppProvider,
  AppContext,
  systemPrompts,
} from "./components/AppContext";
import Sidebar from "./components/Sidebar";
import ChatFeed from "./components/ChatFeed";
import InputSection from "./components/InputSection";
import CCInputSection from "./components/CCInputSection";

const App = () => {
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
    handleccButtonClick,
    handleStandardButtonClick,
    handleFocus,
    handleBlur,
    handleThemeChange,
    handlePromptChange,
    handleUserPromptChange,
    handleSystemPromptChange,
    handleOpenModal,
    handleCloseModal,
    handleOpenPromptModal,
    handleClosePromptModal,
    handleDeleteMessage
  } = useContext(AppContext);

  return (
    <div className="app">
      <Sidebar />
      <section
        className="main"
        style={{
          minWidth: isSidebarCollapsed ? "100%" : "calc(100% - 244px)",
        }}
      >
        {<h1>CHAT</h1>}
        <ChatFeed />
        {ccInputSection ? <CCInputSection /> : <InputSection />}

      </section>
    </div>
  );
};

export default App;
