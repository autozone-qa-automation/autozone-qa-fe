import { DeleteModalTemplate } from '@/components/ui/ModalTemplate/DeleteModalTemplate'
import { useDeleteRelease } from '@/hooks/useDeleteRelease'

/**
 * Interface describring the
 * props the components waits for
 */
interface ReleaseDeleteModalProps {
  isOpen: boolean
  onClose: () => void
  releaseId: string | number
  releaseName: string
  onSuccess?: () => void
}

/**
 * @function onSuccess - Function triggered on submit success
 * @param releaseId - Id of the release to be deleted
 * @param releaseName - Name of the release to be deleted (for display purposes)
 * @returns
 */
export function ReleaseDeleteModal({
  isOpen,
  onClose,
  releaseId,
  releaseName,
  onSuccess,
}: ReleaseDeleteModalProps) {
  const { deleteReleaseStatus } = useDeleteRelease()

  const handleDelete = async () => {
    await deleteReleaseStatus(Number(releaseId))
    onSuccess?.()
    onClose()
  }

  return (
    <DeleteModalTemplate
      isOpen={isOpen}
      onClose={onClose}
      onConfirm={handleDelete}
      title="Delete Release"
      entityName={releaseName}
      testIdPrefix="delete-release"
      zIndex={500}
    />
  )
}
