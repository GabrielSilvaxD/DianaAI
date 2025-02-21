import { useEffect, useRef, useState } from "react";
import "./newPrompt.css";
import Upload from "../upload/Upload";
import { IKImage } from "imagekitio-react";
import model from "../../lib/gemini";
import Markdown from "react-markdown";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const NewPrompt = ({ data }) => {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [img, setImg] = useState({
    isLoading: false,
    error: "",
    dbData: {},
    aiData: {},
  });

  const endRef = useRef(null);
  const formRef = useRef(null); // Ref for form element

  useEffect(() => {
    endRef.current.scrollIntoView({ behavior: "smooth" });
  }, [data, question, answer, img.dbData]);

  const queryClient = useQueryClient();

  const mutation = useMutation({
    mutationFn: () => {
      return fetch(`${import.meta.env.VITE_API_URL}/api/chats/${data._id}`, {
        method: "PUT",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          question: question.length ? question : undefined,
          answer,
          img: img.dbData?.filePath || undefined,
        }),
      }).then((res) => res.json());
    },
    onSuccess: () => {
      queryClient
        .invalidateQueries({ queryKey: ["chat", data._id] })
        .then(() => {
          formRef.current.reset();
          setQuestion("");
          setAnswer("");
          setImg({
            isLoading: false,
            error: "",
            dbData: {},
            aiData: {},
          });
        });
    },
    onError: (err) => {
      console.log(err);
    },
  });

  const startChat = () => {
    const history = Array.isArray(data?.history) && data.history.length > 0
      ? data.history.map(({ role, parts }) => ({
          role,
          parts: parts?.[0]?.text ? [{ text: parts[0].text }] : [{ text: "Default message" }],
        }))
      : [{ role: "user", parts: [{ text: "Hello" }] }];

    return model.startChat({
      history,
      generationConfig: {
        // maxOutputTokens: 100, // Uncomment if needed
      },
    });
  };

  const add = async (text, isInitial) => {
    if (!text?.trim()) return; // Guard against empty or undefined input
    if (!isInitial) setQuestion(text);

    try {
      const chat = startChat(); // Create chat instance here, not in render
      const content = Object.entries(img.aiData).length ? [img.aiData, text] : [text];
      const result = await chat.sendMessageStream(content);
      let accumulatedText = "";
      for await (const chunk of result.stream) {
        const chunkText = chunk.text();
        accumulatedText += chunkText;
        setAnswer(accumulatedText);
      }
      mutation.mutate();
    } catch (err) {
      console.error("Chat error:", err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const text = e.target.text.value;
    if (!text?.trim()) return;
    add(text, false);
  };

  // Initialize chat with first history message, if applicable
  const hasRun = useRef(false);
  useEffect(() => {
    if (!hasRun.current && Array.isArray(data?.history) && data.history.length === 1) {
      const initialText = data.history[0]?.parts?.[0]?.text;
      if (initialText?.trim()) {
        add(initialText, true);
      }
    }
    hasRun.current = true;
  }, [data]); // Depend on data only

  return (
    <>
      {img.isLoading && <div className="">Loading...</div>}
      {img.dbData?.filePath && (
        <IKImage
          urlEndpoint={import.meta.env.VITE_IMAGE_KIT_ENDPOINT}
          path={img.dbData?.filePath}
          width="380"
          transformation={[{ width: 380 }]}
        />
      )}
      {question && <div className="message user">{question}</div>}
      {answer && (
        <div className="message">
          <Markdown>{answer}</Markdown>
        </div>
      )}
      <div className="endChat" ref={endRef}></div>
      <form className="newForm" onSubmit={handleSubmit} ref={formRef}>
        <Upload setImg={setImg} />
        <input id="file" type="file" multiple={false} hidden />
        <input type="text" name="text" placeholder="Ask anything..." />
        <button>
          <img src="/arrow.png" alt="" />
        </button>
      </form>
    </>
  );
};

export default NewPrompt;