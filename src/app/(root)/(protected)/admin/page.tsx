'use client'

import { adminAction } from '@/actions/admin'
import RoleGate from '@/components/auth/role-gate'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'

function AdminPage() {
  const onApiRouteClick = async () => {
    await fetch('/api/admin').then(res => {
      if (res.ok) {
        toast({
          title: 'Allowed API Route!',
          description: new Date().toLocaleDateString(),
          variant: 'success',
        })
      } else {
        toast({
          title: 'Forbidden API Route!',
          description: new Date().toLocaleDateString(),
          variant: 'destructive',
        })
      }
    })
  }

  const onAdminActionClick = async () => {
    const res = await adminAction()
    if (res === 'SUCCESS') {
      toast({
        title: 'Allowed Admin action!',
        description: new Date().toLocaleDateString(),
        variant: 'success',
      })
    } else {
      toast({
        title: 'Forbidden admin action!',
        description: new Date().toLocaleDateString(),
        variant: 'destructive',
      })
    }
  }
  return (
    <Card className="w-[600px]">
      <CardHeader>
        <p className="texxt-2xl bg- text-center font-semibold">🔑 Admin</p>
      </CardHeader>
      <CardContent className="space-y-4">
        <RoleGate allowedRole="ADMIN">{<p>Only admin can access this content</p>}</RoleGate>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only API route</p>
          <Button onClick={onApiRouteClick}>Click to test</Button>
        </div>
        <div className="flex items-center justify-between rounded-lg border p-3 shadow-md">
          <p className="text-sm font-medium">Admin-only server action</p>
          <Button onClick={onAdminActionClick}>Click to test</Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default AdminPage
