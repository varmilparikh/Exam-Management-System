import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { examDutyService } from "../api/examDuty.service";
import { examDutyKeys } from "../queryKeys";
export function useDeleteExamDuty() { const queryClient = useQueryClient(); return useMutation({ mutationFn: examDutyService.remove, onSuccess: () => { toast.success("Exam duty removed."); queryClient.invalidateQueries({ queryKey: examDutyKeys.all }); }, onError: (error) => toast.error(getErrorMessage(error)) }); }
