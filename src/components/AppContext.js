import React, {
  createContext,
  useState,
  useRef,
  useEffect,
  useContext,
} from "react";
import { themes } from "./themes";
import { useTheme } from "./themeContext";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { synthwave84 } from "react-syntax-highlighter/dist/esm/styles/prism";

export const AppContext = createContext();

// might want to put this back to normal later, or put in a separate component
export const systemPrompts = [
  {
    name: "Companion/Custom",
    prompt:
      "You are a helpful AI assistant with the personality and speech mannerisms of a cute anime companion.",
  },
  {
    name: "Senior React Developer",
    prompt:
      "You are a senior web developer with 20 years of experience. You have in-depth knowledge of the react.js library. You enjoy helping developers solve problems by assisting in the most optimal way possible, providing explanations and examples.",
  },
  {
    name: "Senior Web Developer",
    prompt:
      "You are a senior web developer with 20 years of experience. You have in-depth knowledge web development. You enjoy helping developers solve problems by assisting in the most optimal way possible, providing explanations and examples.",
  },
  {
    name: "Professional Assistant",
    prompt:
      "You are a professional assistant who can provide detailed information on any topic.",
  },
];

export const AppProvider = (props) => {
  const [userPrompt, setUserPrompt] = useState("");
  const [message, setMessage] = useState(null);
  const [chatHistory, setChatHistory] = useState([]);
  const [systemPrompt, setSystemPrompt] = useState(
    "You are a helpful AI assistant with the personality and speech mannerisms of a cute anime companion."
  );
  const [temperature, setTemperature] = useState(0.7);
  const [model, setModel] = useState("gpt-4o");
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
  const [systemPromptCharCount, setSystemPromptCharCount] = useState(0);
  const [userPromptCharCount, setUserPromptCharCount] = useState(0);
  const [baseMaxTokens, setBaseMaxTokens] = useState(128000);
  const [totalTokensUsed, setTotalTokensUsed] = useState(0);
  const [playingAudio, setPlayingAudio] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const userPromptRef = useRef();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isRegisterModalOpen, setIsRegisterModalOpen] = useState(false);
  const [isSaveDialogOpen, setIsSaveDialogOpen] = useState(false);
  const [user, setUser] = useState("");
  const [ccInputSection, setccInputSection] = useState(false);
  const [systemPrompt1, setSystemPrompt1] = useState(
    "AI1:\n\nYou are a part of a two-AI system. You will start every message with a To : (recipient) and From : AI1 to indicate who you are and who you are addressing ( either To : AI2 or To : User ). You can only do one to and from per message you send. \n\nExample :\n\nFrom : AI1\nTo : AI2\n\nYou and AI2 are partners. It is your job to assist the user in the most helpful way possible. His job is to critique your advice and provide corrections and alternatives. Please try not to let more than 5 messages go by before addressing the user just to check in. Make sure you consult him before responding to the user for the first time.\n"
  );
  const [systemPrompt2, setSystemPrompt2] = useState(
    "AI2:\n\nYou are a part of a two-AI system. You will start every message with a To : (recipient) and From : AI2 to indicate who you are and who you are addressing ( either To : AI1 or To : User ). You can only do one to and from per message you send. \n\nExample :\n\nFrom : AI2\nTo : AI1\n\nYou and AI1 are partners. It is his job to assist the user in the most helpful way possible. Your job is to critique your advice and provide corrections and alternatives. Please try not to let more than 5 messages go by before addressing the user just to check in.\n"
  );
  const { theme, setTheme } = useTheme();

  const handleClearChat = () => {
    setChatHistory([]);
  };

  const toggleSidebar = () => {
    setIsSidebarCollapsed(!isSidebarCollapsed);
  };

  function ModelButton({ model, displayName, currentModel, onClick }) {
    return (
      <button
        className={`model-button ${model === currentModel ? "selected" : ""}`}
        onClick={() => onClick(model)}
      >
        {displayName}
      </button>
    );
  }

  const getMessages = async (systemPromptForThisCall = systemPrompt) => {
    setIsLoading(true);

    const options = {
      method: "POST",
      body: JSON.stringify({
        message: userPrompt,
        chatHistory: chatHistory,
        systemPrompt: systemPromptForThisCall,
        temperature: temperature,
        // set max tokens to 4000 for gpt-4-1106-preview and gpt-4o models because of different architecture
        maxTokens: model === "gpt-4-1106-preview" || "gpt-4o" ? 4000 : remainingTokens,
        model: model,
      }),
      headers: {
        "Content-Type": "application/json",
      },
    };

    try {
      const response = await fetch(
        "https://llm-pro-ui-server.onrender.com/completions",
        options
      );
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();

      setMessage(data.choices[0].content);
      setChatHistory([
        ...chatHistory,
        { role: "user", content: userPrompt },
        { role: "system", content: data.choices[0].message.content },
      ]);
      setTotalTokensUsed(totalTokensUsed + data.usage.total_tokens);

      //clear the input if the fetch was successful!
      setUserPrompt("");
    } catch (error) {
      console.error(error);
      alert(
        "There was a problem completing your request, please try again. If the problem persists, check to see if you have enough remaining tokens to complete the request or consider altering your prompt."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      // Check if the target is the user prompt textarea
      if (event.target === userPromptRef.current) {
        event.preventDefault(); // Prevents creating a new line when pressing Enter
        getMessages();
      }
    }
  };

  const handleFocus = (e) => {
    e.target.style.height = "inherit";
    const computed = window.getComputedStyle(e.target);
    const height =
      parseInt(computed.getPropertyValue("border-top-width"), 10) +
      parseInt(computed.getPropertyValue("padding-top"), 10) +
      e.target.scrollHeight +
      parseInt(computed.getPropertyValue("padding-bottom"), 10) +
      parseInt(computed.getPropertyValue("border-bottom-width"), 10);

    e.target.style.height = height > 200 ? "200px" : `${height}px`;
  };

  const handleBlur = (e) => {
    e.target.style.height = "20px";
  };

  const components = {
    code({ node, inline, className, children, ...props }) {
      const match = /language-(\w+)/.exec(className || "");
      return !inline && match ? (
        <SyntaxHighlighter
          style={synthwave84}
          customStyle={{
            ...synthwave84,
            borderRadius: "3px",
            whiteSpace: "pre-wrap",
            fontSize: "14px",
          }}
          language={match[1]}
          PreTag="div"
          children={String(children).replace(/\n$/, "")}
          {...props}
        />
      ) : (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
  };

  // Text-to-Speech Functionality

  const convertTextToSpeech = async (text) => {
    try {
      if (playingAudio) {
        playingAudio.pause();
        setPlayingAudio(null);
        return;
      }

      const response = await fetch("https://llm-pro-ui-server.onrender.com/text-to-speech", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ text }),
      });

      if (response.ok) {
        const audio = new Audio(URL.createObjectURL(await response.blob()));
        audio.addEventListener("ended", () => setPlayingAudio(null));
        audio.play();
        setPlayingAudio(audio);
      } else {
        console.error("Error converting text to speech");
      }
    } catch (error) {
      console.error("Error converting text to speech:", error);
    }
  };

  useEffect(() => {
    switch (model) {
      case "gpt-3.5-turbo":
        setBaseMaxTokens(2000);
        break;
      case "gpt-3.5-turbo-16k":
        setBaseMaxTokens(16000);
        break;
      case "gpt-4":
        setBaseMaxTokens(8000);
        break;
      case "gpt-4-1106-preview":
        setBaseMaxTokens(128000);
        break;
      case "gpt-4o":
        setBaseMaxTokens(128000);
        break;
      default:
        setBaseMaxTokens(2000); // default value
    }
  }, [model]);

  const handleSystemPromptChange = (e) => {
    const systemPrompt = e.target.value;
    setSystemPrompt(systemPrompt);
    setSystemPromptCharCount(Math.ceil(systemPrompt.length / 3));
  };

  const handleUserPromptChange = (e) => {
    const userPrompt = e.target.value;
    setUserPrompt(userPrompt);
    setUserPromptCharCount(Math.ceil(userPrompt.length / 3));
  };

  const estimateTokenCount = (message) => Math.ceil(message.length / 3);
  const chatHistoryTokenCount = chatHistory.reduce(
    (total, message) => total + estimateTokenCount(message.content),
    0
  );

  /*new gpt 4 turbo has max context of 128k but can only have 4000 in the completion,
  will have to find a way to separate completion tokens and max tokens in a way that,
  will indicate how much remaining tokens there are totally instead of how much will,
  go into the completion
  */
  let remainingTokens =
    baseMaxTokens -
    systemPromptCharCount -
    userPromptCharCount -
    chatHistoryTokenCount;

  // mapping function,,, may want to put this in the chatfeed component later
  const mapRoleToDisplay = (role) => {
    switch (role) {
      case "user":
        return "You";
      case "system":
        return "AI";
      default:
        return role;
    }
  };

  const handleDeleteMessage = (indexToDelete) => {
    setChatHistory(chatHistory.filter((_, index) => index !== indexToDelete));
  };

  useEffect(() => {
    setUserPromptCharCount(Math.ceil(userPrompt.length / 3));
  }, [userPrompt]);

  useEffect(() => {
    if (ccInputSection) {
      const combinedPrompt = systemPrompt1 + systemPrompt2;
      setSystemPromptCharCount(Math.ceil(combinedPrompt.length / 3));
    } else {
      setSystemPromptCharCount(Math.ceil(systemPrompt.length / 3));
    }
  }, [systemPrompt, systemPrompt1, systemPrompt2, ccInputSection]);

  // theme and system prompt logic for changes and modals

  const handleThemeChange = (themeName) => {
    setTheme(themes[themeName]);
    handleCloseModal();
  };

  useEffect(() => {
    for (const key in theme) {
      if (theme.hasOwnProperty(key)) {
        document.documentElement.style.setProperty(key, theme[key]);
      }
    }
  }, [theme]);

  useEffect(() => {
    const dialog = document.querySelector("dialog");

    dialog.addEventListener("click", (e) => {
      const rect = dialog.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        handleCloseModal();
      }
    });
  }, []);

  const handleOpenModal = () => {
    const dialog = document.querySelector("#themeDialog");
    dialog.showModal();
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    const dialog = document.querySelector("#themeDialog");
    dialog.close();
    setIsModalOpen(false);
  };

  // double check this code later !!!!!!!! may be unecessary
  const handleOpenLoginModal = () => {
    const dialog = document.querySelector("#loginDialog");
    dialog.showModal();
    setIsLoginModalOpen(true);
  };

  const handleCloseLoginModal = () => {
    const dialog = document.querySelector("#loginDialog");
    dialog.close();
    setIsLoginModalOpen(false);
  };

  const handleOpenRegisterModal = () => {
    const dialog = document.querySelector("#registerDialog");
    dialog.showModal();
    handleCloseLoginModal();
    setIsRegisterModalOpen(true);
  };

  const handleCloseRegisterModal = () => {
    const dialog = document.querySelector("#registerDialog");
    dialog.close();
    setIsRegisterModalOpen(false);
  };

  const handleOpenPromptModal = () => {
    const dialog = document.querySelector("#promptDialog");
    dialog.showModal();
    setIsPromptModalOpen(true);
  };

  const handleClosePromptModal = () => {
    const dialog = document.querySelector("#promptDialog");
    dialog.close();
    setIsPromptModalOpen(false);
  };

  const handleOpenSaveDialog = () => {
    const dialog = document.querySelector("#saveDialog");
    dialog.showModal();
    setIsSaveDialogOpen(true);
    console.log("save dialog open");
  };

  const handleCloseSaveDialog = () => {
    const dialog = document.querySelector("#saveDialog");
    dialog.close();
    setIsSaveDialogOpen(false);
  };

  const handlePromptChange = (prompt) => {
    setSystemPrompt(prompt);
    handleClosePromptModal();
  };

  useEffect(() => {
    const dialog = document.querySelector("#promptDialog");

    const handleClickOutside = (e) => {
      const rect = dialog.getBoundingClientRect();
      if (
        e.clientX < rect.left ||
        e.clientX > rect.right ||
        e.clientY < rect.top ||
        e.clientY > rect.bottom
      ) {
        handleClosePromptModal();
      }
    };

    dialog.addEventListener("click", handleClickOutside);

    // Cleanup function
    return () => {
      dialog.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // conference call settings

  const handleStandardButtonClick = () => {
    setccInputSection(false);
  };

  const handleccButtonClick = () => {
    setccInputSection(true);
  };

  useEffect(() => {
    // Only proceed if conference call is active
    if (ccInputSection) {
      // Only proceed if there is at least one message in the chat history
      if (chatHistory.length > 0) {
        const lastMessage = chatHistory[chatHistory.length - 1];

        // Only proceed if the last message is from the system and has content
        if (lastMessage.role === "system" && lastMessage.content) {
          const parsed = parseMessage(lastMessage.content);

          if (parsed.to === "AI1" || !parsed.to) {
            // Set systemPrompt1 and re-call getMessages
            setSystemPrompt(systemPrompt1);
            getMessages(systemPrompt1);
          } else if (parsed.to === "AI2") {
            // Set systemPrompt2 and re-call getMessages
            setSystemPrompt(systemPrompt2);
            getMessages(systemPrompt2);
          }
        }
      }
    }
  }, [chatHistory]);

  const parseMessage = (message) => {
    console.log(message);
    const fromRegex = /From\s*:\s*(AI1|AI2|User)/;
    const toRegex = /To\s*:\s*(AI1|AI2|User)/;

    const fromMatch = message.match(fromRegex);
    const toMatch = message.match(toRegex);

    const from = fromMatch ? fromMatch[1] : null;
    const to = toMatch ? toMatch[1] : null;

    return { from, to };
  };

  useEffect(() => {
    if (ccInputSection) {
      setSystemPrompt(systemPrompt1);
    } else {
      setSystemPrompt(
        "You are a helpful AI assistant with the personality and speech mannerisms of a cute anime companion."
      );
    }
  }, [ccInputSection]);

  const handleSystemPrompt1Change = (e) => {
    const newSystemPrompt1 = e.target.value;
    setSystemPrompt1(newSystemPrompt1);

    if (ccInputSection) {
      const combinedPrompt = newSystemPrompt1 + systemPrompt2;
      setSystemPromptCharCount(Math.ceil(combinedPrompt.length / 3));
    }
  };

  const handleSystemPrompt2Change = (e) => {
    const newSystemPrompt2 = e.target.value;
    setSystemPrompt2(newSystemPrompt2);

    if (ccInputSection) {
      const combinedPrompt = systemPrompt1 + newSystemPrompt2;
      setSystemPromptCharCount(Math.ceil(combinedPrompt.length / 3));
    }
  };

  // functions for user accounts ------------------------------------------------------
  async function handleLogout() {
    try {
      const response = await fetch("http://localhost:8000/logout", {
        method: "POST",
        credentials: "include",
      });
      if (!response.ok) {
        throw new Error("Logout failed");
      }
      setUser(null);
    } catch (error) {
      console.error(error);
    }
    handleCloseLoginModal();
  }

  return (
    <AppContext.Provider
      value={{
        userPrompt,
        setUserPrompt,
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
        //convoTitle,
        handleDeleteMessage,
        handleLogout,
      }}
    >
      {props.children}
    </AppContext.Provider>
  );
};
