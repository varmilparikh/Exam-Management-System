import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getErrorMessage } from "@/lib/getErrorMessage";
import { examDutyService } from "../api/examDuty.service";
import { examDutyKeys } from "../queryKeys";
import type { DutyStatus } from "../types/examDuty";
export function useUpdateExamDuty() { const queryClient = useQueryClient(); return useMutation({ mutationFn: ({ id, status }: { id: string; status: DutyStatus }) => examDutyService.updateStatus(id, status), onSuccess: () => { toast.success("Duty status updated."); queryClient.invalidateQueries({ queryKey: examDutyKeys.all }); }, onError: (error) => toast.error(getErrorMessage(error)) }); }
