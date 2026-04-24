import { useQuery, useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import toast from 'react-hot-toast'
import { QUERY_KEYS } from '@/constants/queryKeys'
import { sentenceService } from '@/services/api/sentenceService'

// ─── Fetch list with filters (paginated, for legacy use) ──────────────────────
export const useSentences = (filters = {}) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SENTENCES, filters],
    queryFn: () => sentenceService.getAll(filters),
    staleTime: 1000 * 60 * 2,
  })
}

// ─── Infinite scroll list ──────────────────────────────────────────────────────
const INFINITE_PAGE_SIZE = 8

export const useInfiniteSentences = (filters = {}) => {
  const { page: _page, limit: _limit, ...restFilters } = filters
  return useInfiniteQuery({
    queryKey: [QUERY_KEYS.SENTENCES, 'infinite', restFilters],
    queryFn: ({ pageParam }) =>
      sentenceService.getAll({ ...restFilters, page: pageParam, limit: INFINITE_PAGE_SIZE }),
    initialPageParam: 1,
    getNextPageParam: (lastPage) =>
      lastPage.page < lastPage.totalPages ? lastPage.page + 1 : undefined,
    staleTime: 1000 * 60 * 2,
  })
}

// ─── Fetch single ──────────────────────────────────────────────────────────────
export const useSentence = (id) => {
  return useQuery({
    queryKey: [QUERY_KEYS.SENTENCE_DETAIL, id],
    queryFn: () => sentenceService.getById(id),
    enabled: !!id,
  })
}

// ─── Create ────────────────────────────────────────────────────────────────────
export const useCreateSentence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: sentenceService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SENTENCES] })
      toast.success('Sentence added successfully!')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to add sentence')
    },
  })
}

// ─── Update ────────────────────────────────────────────────────────────────────
export const useUpdateSentence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: ({ id, data }) => sentenceService.update(id, data),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SENTENCES] })
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SENTENCE_DETAIL, id] })
      toast.success('Sentence updated successfully!')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update sentence')
    },
  })
}

// ─── Delete ────────────────────────────────────────────────────────────────────
export const useDeleteSentence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: sentenceService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SENTENCES] })
      toast.success('Sentence deleted.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to delete sentence')
    },
  })
}

// ─── Approve toggle (admin only) ───────────────────────────────────────────────
export const useApproveSentence = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: sentenceService.approve,
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.SENTENCES] })
      toast.success(data?.data?.isApproved ? 'Sentence approved.' : 'Approval removed.')
    },
    onError: (err) => {
      toast.error(err.message || 'Failed to update approval')
    },
  })
}
