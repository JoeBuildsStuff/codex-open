import { getEnvironments } from "@/app/environment/_lib/queries";
import ChatForm from "./chat-form";

export default async function ChatFormWrapper() {
  const { data: environments } = await getEnvironments({});
  
  return <ChatForm environments={environments} />;
}
