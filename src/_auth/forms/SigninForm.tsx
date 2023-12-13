import {useForm} from "react-hook-form";
import {SigninValidation} from "@/lib/validation";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {useSignInAccount} from "@/lib/react-query/queriesAndMutatios.ts";
import {Button} from "@/components/ui/button.tsx";
import Loading from "@/components/shared/Loading.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useToast} from "@/components/ui/use-toast.ts";
import {useUserContext} from "@/context/AuthContext.tsx";

const SigninForm = () => {
  const {toast} = useToast()
  const navigate = useNavigate()
  const {checkAuth} = useUserContext()
  const {mutateAsync: signIn, isPending} = useSignInAccount()
  const form = useForm<z.infer<typeof SigninValidation>>({
    resolver: zodResolver(SigninValidation),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = async (data: z.infer<typeof SigninValidation>) => {
    try {
      const session = await signIn(data)

      if (!session) {
        return toast({title: 'Sign in failed. Please try again'})
      }
      const isLoggedIn = await checkAuth()
      if (isLoggedIn) {
        form.reset()
        navigate('/')
      }
      if (!isLoggedIn) {
        form.reset({
          email: data.email,
          password: ''
        })
        toast({title: 'Sign in failed. Please try again'})
      }
    } catch (e) {
      console.log(e)
    }
  }
  return (
    <Form {...form}>
      <div className={"sm:w-420 flex-center flex-col"}>
        <img src={'/assets/images/logo.svg'} alt={'logo'}/>

        <h2 className={'h3-bold md:h2-bold pt-5 sm:pt-12'}>Sign in to an account</h2>

        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name={"email"}
            render={({field}) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input className={"shad-input"} placeholder="Enter email" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"password"}
            render={({field}) => (
              <FormItem>
                <FormLabel>Password</FormLabel>
                <FormControl>
                  <Input type={'password'} className={"shad-input"} placeholder="Enter password" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button type="submit" variant={'outline'} className={"w-full shad-button_primary"}>
            {isPending ? (
              <div className={'flex-center gap-2'}>
                <Loading/>
              </div>
            ) : "Sign in"}
          </Button>
          <p>Don't have an account?
            <Link to={'/sign-up'} className={'text-primary-500 font-semibold ml-2'}>Sign up</Link></p>

        </form>
      </div>
    </Form>
  );
};

export default SigninForm;

