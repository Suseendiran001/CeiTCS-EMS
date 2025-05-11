import React, { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const changeRequestSchema = z.object({
  section: z.string({
    required_error: "Please select the information section you want to change",
  }),
  field: z.string().min(2, {
    message: "Field name is required",
  }),
  currentValue: z.string().optional(),
  requestedValue: z.string().min(1, {
    message: "Requested value is required",
  }),
  reason: z.string().min(10, {
    message: "Please provide a brief reason for the change request",
  }),
});

type ChangeRequestFormValues = z.infer<typeof changeRequestSchema>;

const ProfileChangeRequest = ({ triggerElement }: { triggerElement: React.ReactNode }) => {
  const { toast } = useToast();
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with React Hook Form and Zod validation
  const form = useForm<ChangeRequestFormValues>({
    resolver: zodResolver(changeRequestSchema),
    defaultValues: {
      section: "",
      field: "",
      currentValue: "",
      requestedValue: "",
      reason: "",
    },
  });

  const onSubmit = async (data: ChangeRequestFormValues) => {
    setIsSubmitting(true);
    try {
      // In a real implementation, this would be an API call
      console.log("Submitting change request:", data);

      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast({
        title: "Change Request Submitted",
        description: "Your profile change request has been submitted successfully. HR will review your request.",
      });
      
      setOpen(false);
      form.reset();
    } catch (error) {
      console.error("Error submitting change request:", error);
      toast({
        title: "Error",
        description: "Failed to submit change request. Please try again later.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{triggerElement}</DialogTrigger>
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Request Profile Information Change</DialogTitle>
          <DialogDescription>
            Submit a request to update information in your profile. HR will review your request and make the changes.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 py-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="section"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Information Section</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select section" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="personal">Personal Information</SelectItem>
                        <SelectItem value="employment">Employment Details</SelectItem>
                        <SelectItem value="education">Education</SelectItem>
                        <SelectItem value="bank">Bank Details</SelectItem>
                        <SelectItem value="documents">Documents</SelectItem>
                        <SelectItem value="address">Address</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="field"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Field to Change</FormLabel>
                    <FormControl>
                      <Input placeholder="E.g. Phone Number, Address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="currentValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Current Value</FormLabel>
                  <FormControl>
                    <Input placeholder="Current value (if any)" {...field} />
                  </FormControl>
                  <FormDescription>
                    Leave blank if there is no current value
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="requestedValue"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Requested Value</FormLabel>
                  <FormControl>
                    <Input placeholder="New value you are requesting" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for Change</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Please explain briefly why you are requesting this change"
                      className="resize-none"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ProfileChangeRequest;