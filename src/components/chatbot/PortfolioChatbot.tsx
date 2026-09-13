import { useCallback, useEffect, useRef, useState } from "react";
import {
  CHATBOT_OPEN_KEY,
  getAssistantReply,
  INITIAL_ASSISTANT_MESSAGE,
  type ContextMessage,
} from "@/lib/portfolioAssistant";
import { useSound } from "@/context/SoundContext";
import { lockBodyScroll, unlockBodyScroll } from "@/lib/bodyScrollLock";
import { ChatbotButton } from "./ChatbotButton";
import { ChatWindow } from "./ChatWindow";
import type { MessageData } from "./ChatMessage";

const MAX_MESSAGES = 20;
const TYPING_DELAY_MS = 480;

function createId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function createInitialMessage(): MessageData {
  return {
    id: createId(),
    role: "assistant",
    content: INITIAL_ASSISTANT_MESSAGE,
  };
}

function readOpenPreference(): boolean {
  try {
    return localStorage.getItem(CHATBOT_OPEN_KEY) === "true";
  } catch {
    return false;
  }
}

function persistOpenPreference(open: boolean) {
  try {
    localStorage.setItem(CHATBOT_OPEN_KEY, open ? "true" : "false");
  } catch {
    /* ignore */
  }
}

export function PortfolioChatbot() {
  const { play } = useSound();
  const [isOpen, setIsOpen] = useState(readOpenPreference);
  const [messages, setMessages] = useState<MessageData[]>(() => [createInitialMessage()]);
  const [isTyping, setIsTyping] = useState(false);
  const typingLock = useRef(false);
  const replyTimeout = useRef<number | null>(null);

  const toggleOpen = useCallback(() => {
    setIsOpen((prev) => {
      const next = !prev;
      persistOpenPreference(next);
      play(next ? "open" : "close");
      return next;
    });
  }, [play]);

  const closeChat = useCallback(() => {
    setIsOpen(false);
    persistOpenPreference(false);
    play("close");
  }, [play]);

  const clearChat = useCallback(() => {
    if (replyTimeout.current) {
      window.clearTimeout(replyTimeout.current);
      replyTimeout.current = null;
    }
    typingLock.current = false;
    setMessages([createInitialMessage()]);
    setIsTyping(false);
    play("click");
  }, [play]);

  const toContext = useCallback((list: MessageData[]): ContextMessage[] => {
    return list.slice(-MAX_MESSAGES).map((m) => ({
      role: m.role,
      content: m.content,
    }));
  }, []);

  useEffect(() => {
    if (!isOpen) return;

    const isMobile = window.matchMedia("(max-width: 1023px)").matches;
    if (!isMobile) return;

    lockBodyScroll();
    return () => unlockBodyScroll();
  }, [isOpen]);

  const sendMessage = useCallback(
    (text: string) => {
      const trimmed = text.trim();
      if (!trimmed || typingLock.current) return;

      play("click");
      typingLock.current = true;
      setIsTyping(true);

      let historyForReply: ContextMessage[] = [];

      setMessages((prev) => {
        const userMessage: MessageData = {
          id: createId(),
          role: "user",
          content: trimmed,
        };
        historyForReply = toContext(prev);
        return [...prev, userMessage].slice(-MAX_MESSAGES);
      });

      const reply = getAssistantReply(trimmed, historyForReply);
      const content =
        reply.content.trim() ||
        "I'm not sure how to answer that yet. Try asking about Anand's skills, experience, notice period, or contact details.";

      if (replyTimeout.current) window.clearTimeout(replyTimeout.current);

      replyTimeout.current = window.setTimeout(() => {
        setMessages((prev) =>
          [
            ...prev,
            {
              id: createId(),
              role: "assistant" as const,
              content,
              actions: reply.actions,
            },
          ].slice(-MAX_MESSAGES),
        );
        typingLock.current = false;
        setIsTyping(false);
        replyTimeout.current = null;
        play("success");
      }, TYPING_DELAY_MS);
    },
    [play, toContext],
  );

  return (
    <>
      <ChatbotButton isOpen={isOpen} onClick={toggleOpen} />
      <ChatWindow
        isOpen={isOpen}
        onClose={closeChat}
        messages={messages}
        isTyping={isTyping}
        onSend={sendMessage}
        onClear={clearChat}
      />
    </>
  );
}
