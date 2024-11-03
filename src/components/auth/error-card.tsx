import { BackButton } from '@/components/auth/back-button'
import { Header } from '@/components/auth/header'
import { Card, CardFooter, CardHeader } from '@/components/ui/card'
import { ExclamationTriangleIcon } from '@radix-ui/react-icons'

function ErrorCard() {
  return (
    <Card className="w-[400px] shadow-md">
      <CardHeader className="">
        <Header />
        <div className="flex items-center justify-center gap-x-2">
          <ExclamationTriangleIcon className="text-destructive" />
          <span className="text-sm text-muted-foreground"> Oops! Somthing went wrong!</span>
        </div>
      </CardHeader>
      <CardFooter>
        <BackButton label="Back to login" href="/auth/login" />
      </CardFooter>
    </Card>
  )
}

export default ErrorCard
