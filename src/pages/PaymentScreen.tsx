
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, CreditCard, Landmark, Phone, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/Loading";

// Mock booking for payment
const mockBooking = {
  id: "1",
  providerId: "1",
  providerName: "John Okafor",
  service: "Pipe Installation and Repair",
  date: "2023-11-15",
  time: "14:00",
  cost: "₦5,000"
};

const PaymentScreen = () => {
  const { bookingId } = useParams<{ bookingId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [booking, setBooking] = useState<any>(null);
  const [processing, setProcessing] = useState(false);
  
  // Card payment form state
  const [cardForm, setCardForm] = useState({
    cardNumber: "",
    expiry: "",
    cvv: "",
    name: ""
  });
  
  // Bank transfer form state
  const [bankForm, setBankForm] = useState({
    accountNumber: "",
    bankName: "",
    accountName: ""
  });
  
  // Mobile money form state
  const [mobileForm, setMobileForm] = useState({
    phoneNumber: "",
    provider: "mtn" // mtn, airtel, glo, 9mobile
  });

  useEffect(() => {
    // Simulate API call to fetch booking details
    const timer = setTimeout(() => {
      setBooking(mockBooking);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [bookingId]);

  const handleCardFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCardForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBankFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setBankForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleMobileFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setMobileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();
    setProcessing(true);
    
    // Simulate payment processing
    setTimeout(() => {
      setProcessing(false);
      toast({
        title: "Payment Successful",
        description: "Your payment has been processed successfully.",
      });
      navigate("/bookings");
    }, 2000);
  };

  if (loading) {
    return <Loading />;
  }

  if (!booking) {
    return (
      <div className="text-center py-12">
        <p className="text-lg text-connectify-darkGray">Booking not found</p>
        <Button onClick={() => navigate("/bookings")} className="mt-4">
          Go Back to Bookings
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <Button 
        variant="ghost" 
        className="mb-4 pl-0" 
        onClick={() => navigate(-1)}
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Back
      </Button>

      <div className="bg-white rounded-lg shadow p-6 mb-6">
        <h1 className="text-2xl font-bold text-connectify-darkGray mb-4">Payment</h1>
        
        <div className="space-y-4">
          <div className="flex justify-between">
            <span className="text-connectify-mediumGray">Provider</span>
            <span className="font-medium">{booking.providerName}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-connectify-mediumGray">Service</span>
            <span>{booking.service}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-connectify-mediumGray">Date & Time</span>
            <span>{booking.date} at {booking.time}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-connectify-mediumGray">Amount</span>
            <span className="text-xl font-bold text-connectify-darkGray">{booking.cost}</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Select Payment Method</h2>
        
        <Tabs defaultValue="card">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="card" className="flex items-center gap-2">
              <CreditCard className="h-4 w-4" />
              <span>Card</span>
            </TabsTrigger>
            <TabsTrigger value="bank" className="flex items-center gap-2">
              <Landmark className="h-4 w-4" />
              <span>Bank</span>
            </TabsTrigger>
            <TabsTrigger value="mobile" className="flex items-center gap-2">
              <Phone className="h-4 w-4" />
              <span>Mobile</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="card">
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input 
                  id="cardNumber"
                  name="cardNumber"
                  value={cardForm.cardNumber}
                  onChange={handleCardFormChange}
                  placeholder="**** **** **** ****"
                  required
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="expiry">Expiry Date</Label>
                  <Input 
                    id="expiry"
                    name="expiry"
                    value={cardForm.expiry}
                    onChange={handleCardFormChange}
                    placeholder="MM/YY"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="cvv">CVV</Label>
                  <Input 
                    id="cvv"
                    name="cvv"
                    value={cardForm.cvv}
                    onChange={handleCardFormChange}
                    placeholder="123"
                    required
                  />
                </div>
              </div>
              
              <div>
                <Label htmlFor="name">Cardholder Name</Label>
                <Input 
                  id="name"
                  name="name"
                  value={cardForm.name}
                  onChange={handleCardFormChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-connectify-blue hover:bg-connectify-darkBlue"
                  disabled={processing}
                >
                  {processing ? "Processing..." : `Pay ${booking.cost}`}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="bank">
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <Label htmlFor="bankName">Bank Name</Label>
                <select 
                  id="bankName"
                  name="bankName"
                  value={bankForm.bankName}
                  onChange={handleBankFormChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="">Select Bank</option>
                  <option value="gtb">Guaranty Trust Bank</option>
                  <option value="access">Access Bank</option>
                  <option value="zenith">Zenith Bank</option>
                  <option value="firstbank">First Bank</option>
                  <option value="uba">UBA</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="accountNumber">Account Number</Label>
                <Input 
                  id="accountNumber"
                  name="accountNumber"
                  value={bankForm.accountNumber}
                  onChange={handleBankFormChange}
                  placeholder="10 digit account number"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="accountName">Account Name</Label>
                <Input 
                  id="accountName"
                  name="accountName"
                  value={bankForm.accountName}
                  onChange={handleBankFormChange}
                  placeholder="John Doe"
                  required
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-connectify-blue hover:bg-connectify-darkBlue"
                  disabled={processing}
                >
                  {processing ? "Processing..." : `Pay ${booking.cost}`}
                </Button>
              </div>
            </form>
          </TabsContent>
          
          <TabsContent value="mobile">
            <form onSubmit={handlePayment} className="space-y-4">
              <div>
                <Label htmlFor="provider">Mobile Provider</Label>
                <select 
                  id="provider"
                  name="provider"
                  value={mobileForm.provider}
                  onChange={handleMobileFormChange}
                  className="w-full p-2 border rounded-md"
                  required
                >
                  <option value="mtn">MTN Mobile Money</option>
                  <option value="airtel">Airtel Money</option>
                  <option value="glo">Glo Money</option>
                  <option value="9mobile">9Mobile Money</option>
                </select>
              </div>
              
              <div>
                <Label htmlFor="phoneNumber">Phone Number</Label>
                <Input 
                  id="phoneNumber"
                  name="phoneNumber"
                  value={mobileForm.phoneNumber}
                  onChange={handleMobileFormChange}
                  placeholder="+234 XXX XXX XXXX"
                  required
                />
              </div>

              <div className="flex justify-center pt-4">
                <Button 
                  type="submit" 
                  className="w-full md:w-auto bg-connectify-blue hover:bg-connectify-darkBlue"
                  disabled={processing}
                >
                  {processing ? "Processing..." : `Pay ${booking.cost}`}
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>
        
        <div className="mt-6 flex items-center justify-center text-sm text-connectify-mediumGray">
          <Shield className="h-4 w-4 mr-2" />
          <span>All payments are secure and encrypted</span>
        </div>
      </div>
    </div>
  );
};

export default PaymentScreen;
