
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import Loading from "@/components/Loading";

// Mock job data
const mockJobs = [
  {
    id: "job1",
    customerId: "cust1",
    customerName: "Chioma Eze",
    service: "Pipe Installation",
    date: "2023-11-15",
    time: "14:00",
    location: "123 Lagos Street, Victoria Island",
    status: "pending",
    notes: "I need a new pipe installed in my bathroom. The old one is leaking.",
    cost: "₦5,000"
  },
  {
    id: "job2",
    customerId: "cust2",
    customerName: "Emmanuel Nwachukwu",
    service: "Drain Cleaning",
    date: "2023-11-17",
    time: "10:00",
    location: "45 Abuja Road, Wuse Zone 4",
    status: "confirmed",
    notes: "Kitchen sink is draining slowly. Needs cleaning.",
    cost: "₦3,500"
  },
  {
    id: "job3",
    customerId: "cust3",
    customerName: "Blessing Ibrahim",
    service: "Fixture Installation",
    date: "2023-11-20",
    time: "16:30",
    location: "78 Port Harcourt Avenue",
    status: "pending",
    notes: "I just bought a new shower head and need it installed.",
    cost: "₦4,500"
  },
  {
    id: "job4",
    customerId: "cust4",
    customerName: "Adeola Johnson",
    service: "Leak Repair",
    date: "2023-11-10",
    time: "11:00",
    location: "22 Lekki Street, Lagos",
    status: "completed",
    notes: "Fixed the leaking faucet in the kitchen.",
    cost: "₦2,500"
  }
];

const ProviderJobs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<any[]>([]);
  const [selectedJob, setSelectedJob] = useState<any>(null);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [jobStatusUpdateOpen, setJobStatusUpdateOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setJobs(mockJobs);
      setLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  const openJobDetails = (job: any) => {
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };

  const openStatusUpdate = (job: any, status: string) => {
    setSelectedJob(job);
    setNewStatus(status);
    setJobStatusUpdateOpen(true);
  };

  const handleStatusUpdate = () => {
    // Simulate API call
    setJobs(prev => 
      prev.map(job => 
        job.id === selectedJob.id 
          ? { ...job, status: newStatus } 
          : job
      )
    );
    
    setJobStatusUpdateOpen(false);
    
    toast({
      title: "Status Updated",
      description: `Job status updated to ${newStatus}.`
    });
  };

  const getFilteredJobs = (status: string) => {
    if (status === "all") return jobs;
    return jobs.filter(job => job.status === status);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center">
        <Button 
          variant="ghost" 
          className="pl-0 mr-4" 
          onClick={() => navigate("/provider-dashboard")}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Dashboard
        </Button>
        <h1 className="text-2xl font-bold text-connectify-darkGray">Job Management</h1>
      </div>

      <Tabs defaultValue="all">
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="confirmed">Confirmed</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
        </TabsList>
        
        {["all", "pending", "confirmed", "completed"].map(tabValue => (
          <TabsContent key={tabValue} value={tabValue} className="space-y-4">
            {getFilteredJobs(tabValue).length === 0 ? (
              <div className="text-center py-12 bg-white rounded-lg shadow">
                <p className="text-connectify-darkGray">No {tabValue !== "all" ? tabValue : ""} jobs found.</p>
              </div>
            ) : (
              getFilteredJobs(tabValue).map(job => (
                <div key={job.id} className="bg-white rounded-lg shadow p-4">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                    <div className="flex-1 mb-4 md:mb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-semibold text-lg">{job.service}</h3>
                          <p className="text-connectify-darkGray">Customer: {job.customerName}</p>
                        </div>
                        <div>
                          {job.status === "pending" && (
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs">Pending</span>
                          )}
                          {job.status === "confirmed" && (
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">Confirmed</span>
                          )}
                          {job.status === "completed" && (
                            <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">Completed</span>
                          )}
                          {job.status === "cancelled" && (
                            <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">Cancelled</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-2 gap-2 mt-3">
                        <div className="flex items-center">
                          <Calendar className="h-4 w-4 text-connectify-mediumGray mr-1" />
                          <span className="text-sm">{job.date}</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="h-4 w-4 text-connectify-mediumGray mr-1" />
                          <span className="text-sm">{job.time}</span>
                        </div>
                        <div className="flex items-center col-span-2">
                          <MapPin className="h-4 w-4 text-connectify-mediumGray mr-1" />
                          <span className="text-sm truncate">{job.location}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex flex-col sm:flex-row gap-2">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => openJobDetails(job)}
                      >
                        View Details
                      </Button>
                      
                      {job.status === "pending" && (
                        <>
                          <Button 
                            size="sm" 
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={() => openStatusUpdate(job, "confirmed")}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Accept
                          </Button>
                          <Button 
                            size="sm" 
                            className="bg-red-600 hover:bg-red-700 text-white"
                            onClick={() => openStatusUpdate(job, "cancelled")}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Decline
                          </Button>
                        </>
                      )}
                      
                      {job.status === "confirmed" && (
                        <Button 
                          size="sm" 
                          className="bg-connectify-blue hover:bg-connectify-darkBlue"
                          onClick={() => openStatusUpdate(job, "completed")}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Mark Completed
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Job Details Dialog */}
      <Dialog open={jobDetailsOpen} onOpenChange={setJobDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedJob.service}</h3>
                <p className="text-sm text-connectify-mediumGray">{selectedJob.status}</p>
              </div>
              
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-connectify-mediumGray">Customer</span>
                  <span>{selectedJob.customerName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-connectify-mediumGray">Date & Time</span>
                  <span>{selectedJob.date} at {selectedJob.time}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-connectify-mediumGray">Location</span>
                  <span>{selectedJob.location}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-connectify-mediumGray">Price</span>
                  <span>{selectedJob.cost}</span>
                </div>
              </div>
              
              <div>
                <h4 className="font-medium">Customer Notes</h4>
                <p className="text-sm mt-1 p-3 bg-gray-50 rounded-md">{selectedJob.notes}</p>
              </div>
              
              <DialogFooter>
                <Button onClick={() => setJobDetailsOpen(false)}>Close</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <Dialog open={jobStatusUpdateOpen} onOpenChange={setJobStatusUpdateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {newStatus === "confirmed" ? "Accept Job Request" : 
               newStatus === "cancelled" ? "Decline Job Request" : 
               "Mark Job as Completed"}
            </DialogTitle>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-4">
              <p>
                {newStatus === "confirmed" ? "Are you sure you want to accept this job request?" : 
                 newStatus === "cancelled" ? "Are you sure you want to decline this job request?" : 
                 "Are you sure you want to mark this job as completed?"}
              </p>
              
              <div className="bg-gray-50 p-3 rounded-md">
                <p className="font-medium">{selectedJob.service}</p>
                <p className="text-sm text-connectify-mediumGray">Customer: {selectedJob.customerName}</p>
                <p className="text-sm text-connectify-mediumGray">{selectedJob.date} at {selectedJob.time}</p>
              </div>
              
              <DialogFooter>
                <Button 
                  variant="outline" 
                  onClick={() => setJobStatusUpdateOpen(false)}
                >
                  Cancel
                </Button>
                <Button 
                  onClick={handleStatusUpdate}
                  className={
                    newStatus === "confirmed" ? "bg-green-600 hover:bg-green-700" :
                    newStatus === "cancelled" ? "bg-red-600 hover:bg-red-700" :
                    "bg-connectify-blue hover:bg-connectify-darkBlue"
                  }
                >
                  Confirm
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderJobs;
