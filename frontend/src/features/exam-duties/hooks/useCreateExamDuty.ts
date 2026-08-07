import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { examDutyService } from "../api/examDuty.service";
import { examDutyKeys } from "../queryKeys";
export function useCreateExamDuty() { const queryClient = useQueryClient(); return useMutation({ mutationFn: examDutyService.create, onSuccess: () => { toast.success("Exam duty assigned successfully."); queryClient.invalidateQueries({ queryKey: examDutyKeys.all }); }, onError: (error) => toast.error(getErrorMessage(error)) }); }
