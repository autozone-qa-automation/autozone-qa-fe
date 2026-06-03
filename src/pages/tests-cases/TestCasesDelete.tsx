/*
 * Tecnológico de Monterrey — Campus Chihuahua
 * Desarrollo e Implantación de Sistemas de Software
 * TC3005B GPO500 - 2026
 * Autozone QA Automation
 */

import { Button, Group, Stack, Text } from '@mantine/core'
import { useDisclosure } from '@mantine/hooks'
import { notifications } from '@mantine/notifications'
import { useState } from 'react'
import { ModalTemplate } from '@/components/ui/ModalTemplate/ModalTemplate'
import type { TestCaseVO } from '@/models/TestCaseVO'
import { testCaseService } from '@/services/testCasesService'

interface TestCasesDeleteProps {
    testCase: TestCaseVO
    onDeleted?: (testCase: TestCaseVO) => void | Promise<void>
}

export function TestCasesDelete({ testCase, onDeleted }: TestCasesDeleteProps) {
    const [isDeleting, setIsDeleting] = useState(false)
    const [confirmOpened, confirmModal] = useDisclosure(false)

    const handleDelete = async () => {
        setIsDeleting(true)

        try {
            await testCaseService.deactivate(testCase.id)
            notifications.show({
                title: '¡Success!',
                message: 'Test case deleted successfully',
                color: 'green',
            })
            await onDeleted?.(testCase)
            confirmModal.close()
        } catch (err) {
            notifications.show({
                title: 'Test Case could not be deleted.',
                message: err instanceof Error ? err.message : 'An unexpected error ocurred.',
                color: 'red',
            })
        } finally {
            setIsDeleting(false)
        }
    }

    return (
        <>
            <Button
                ml="auto"
                variant="filled"
                color="#FF0000"
                w={125}
                disabled={isDeleting}
                onClick={confirmModal.open}
            >
                Delete
            </Button>

            <ModalTemplate
                opened={confirmOpened}
                onClose={() => {
                    if (!isDeleting) confirmModal.close()
                }}
                title="Confirm delete"
            >
                <Stack gap="md">
                    <Text ta="center" fw={700} c="#1A1A1F">
                        ¿Are you sure you want to delete Test Case {testCase.title}?
                    </Text>

                    <Group justify="center" mt="md">
                        <Button
                            bg="#F26621"
                            color="#FFFFFF"
                            loading={isDeleting}
                            onClick={() => void handleDelete()}
                        >
                            Yes
                        </Button>

                        <Button
                            variant="outline"
                            bg="#FFFFFF"
                            color="#8C8C94"
                            disabled={isDeleting}
                            onClick={confirmModal.close}
                        >
                            No
                        </Button>
                    </Group>
                </Stack>
            </ModalTemplate>
        </>
    )
}
