import { buildPageMetadata } from '@/lib/metadata';
import { SellerChatPanel } from '@/components/client-dashboard/SellerChatPanel';
import {
  getClientMessagesData,
  getConversationMessagesData,
} from '@/lib/db/client-dashboard';

export const metadata = buildPageMetadata({
  title: 'Messages',
  description: 'Chat with your hired sellers.',
  path: '/dashboard/messages',
  noIndex: true,
});

export default async function ClientMessagesPage() {
  const conversations = await getClientMessagesData();
  const entries = await Promise.all(
    conversations.map(async (c) => [c.id, await getConversationMessagesData(c.id)] as const)
  );
  const messagesByConversation = Object.fromEntries(entries);

  return (
    <div className="space-y-4">
      <div className="hidden sm:block">
        <h1 className="text-2xl font-bold text-text-primary">Messages</h1>
        <p className="text-sm text-text-muted mt-1">Conversations with sellers on your projects.</p>
      </div>
      <SellerChatPanel
        conversations={conversations}
        messagesByConversation={messagesByConversation}
      />
    </div>
  );
}
