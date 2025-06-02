import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Check, X, Calendar, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import Loading from "@/components/Loading";
import apiService from "@/services/api";
import { Job } from "@/types/api";

const ProviderJobs = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [jobDetailsOpen, setJobDetailsOpen] = useState(false);
  const [jobStatusUpdateOpen, setJobStatusUpdateOpen] = useState(false);
  const [newStatus, setNewStatus] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalJobs, setTotalJobs] = useState(0);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const data = await apiService.getProviderJobs();
        setJobs(data);
      } catch (error) {
        console.error("Error fetching jobs:", error);
        toast({
          title: "Error",
          description: "Failed to load jobs. Please try again.",
          variant: "destructive"
        });
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const filteredJobs = jobs.filter(job => {
    if (filter === "all") return true;
    return job.status === filter;
  });

  const openJobDetails = (job: Job) => {
    setSelectedJob(job);
    setJobDetailsOpen(true);
  };

  const openStatusUpdate = (job: Job, status: string) => {
    setSelectedJob(job);
    setNewStatus(status);
    setJobStatusUpdateOpen(true);
  };

  const handleStatusUpdate = async () => {
    if (!selectedJob) return;

    try {
      await apiService.updateJobStatus(selectedJob.id, newStatus);
      
      // Update local state
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
    } catch (error) {
      console.error("Error updating job status:", error);
      toast({
        title: "Error",
        description: "Failed to update job status. Please try again.",
        variant: "destructive"
      });
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "in_progress":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
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
          onClick={() => navigate("/provider/dashboard")}
        >
          <ArrowLeft className="h-5 w-5 mr-1" />
          Dashboard
        </Button>
        <h1 className="text-2xl font-bold text-connectify-darkGray">Job Management</h1>
      </div>

      <Tabs value={filter} onValueChange={setFilter}>
        <TabsList className="grid grid-cols-4 mb-4">
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="pending">Pending</TabsTrigger>
          <TabsTrigger value="in_progress">In Progress</TabsTrigger>
          <TabsTrigger value="completed">Completed</TabsTrigger>
          <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredJobs.map((job) => (
          <div key={job.id} className="bg-white rounded-lg shadow p-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="flex-1 mb-4 md:mb-0">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-semibold text-lg">{job.title}</h3>
                    <p className="text-connectify-darkGray">Customer: {job.customer_name}</p>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(job.status)}`}>
                      {job.status.replace("_", " ")}
                    </span>
                  </div>
                </div>
                
                <div className="grid grid-cols-2 gap-2 mt-3">
                  <div className="flex items-center">
                    <Calendar className="h-4 w-4 text-connectify-mediumGray mr-1" />
                    <span className="text-sm">{new Date(job.created_at).toLocaleDateString()}</span>
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-4 w-4 text-connectify-mediumGray mr-1" />
                    <span className="text-sm">{job.customer_phone}</span>
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
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      className="flex-1"
                      onClick={() => handleJobAction(job.id, "reject")}
                    >
                      Reject
                    </Button>
                    <Button
                      size="sm"
                      className="flex-1"
                      onClick={() => handleJobAction(job.id, "accept")}
                    >
                      Accept
                    </Button>
                  </div>
                )}
                
                {job.status === "in_progress" && (
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
        ))}
      </div>

      {/* Job Details Dialog */}
      <Dialog open={jobDetailsOpen} onOpenChange={setJobDetailsOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Job Details</DialogTitle>
            <DialogDescription>
              View the complete details of this job request
            </DialogDescription>
          </DialogHeader>
          
          {selectedJob && (
            <div className="space-y-4">
              <div>
                <h3 className="font-semibold text-lg">{selectedJob.title}</h3>
                <p className="text-connectify-darkGray">Customer: {selectedJob.customer_name}</p>
                <p className="text-connectify-darkGray">Phone: {selectedJob.customer_phone}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Description</h4>
                <p className="text-connectify-darkGray">{selectedJob.description}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Schedule</h4>
                <p className="text-connectify-darkGray">{new Date(selectedJob.created_at).toLocaleDateString()}</p>
              </div>
              
              <div>
                <h4 className="font-medium mb-2">Amount</h4>
                <p className="text-connectify-darkGray">{formatCurrency(selectedJob.amount)}</p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Status Update Confirmation Dialog */}
      <Dialog open={jobStatusUpdateOpen} onOpenChange={setJobStatusUpdateOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Update Job Status</DialogTitle>
            <DialogDescription>
              Are you sure you want to update this job's status to {newStatus}?
            </DialogDescription>
          </DialogHeader>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setJobStatusUpdateOpen(false)}
            >
              Cancel
            </Button>
            <Button
              onClick={handleStatusUpdate}
              className="bg-connectify-blue hover:bg-connectify-darkBlue"
            >
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ProviderJobs;
