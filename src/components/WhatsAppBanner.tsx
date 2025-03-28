
import { MessageCircle } from "lucide-react";

const WhatsAppBanner = () => {
  return (
    <div className="whatsapp-banner">
      <MessageCircle className="h-5 w-5 text-green-600" />
      <span>Also available on WhatsApp: +234-XXX-XXX-XXXX</span>
    </div>
  );
};

export default WhatsAppBanner;
