import * as z from "zod";

import {Button} from "@/components/ui/button.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {SignupValidation} from "@/lib/validation";
import Loading from "@/components/shared/Loading.tsx";
import {Link, useNavigate} from "react-router-dom";
import {useToast} from "@/components/ui/use-toast.ts";
import {useCreateUserAccount, useSignInAccount} from "@/lib/react-query/queriesAndMutatios.ts";
import {useUserContext} from "@/context/AuthContext.tsx";


const SignupForm = () => {
  const navigate = useNavigate()
  const {checkAuth} = useUserContext()
  const {toast} = useToast()
  const {mutateAsync: createUserAccount, isPending: loadingCreateAccount} = useCreateUserAccount()
  const {mutateAsync: signInAccount} = useSignInAccount()
  const form = useForm<z.infer<typeof SignupValidation>>({
    resolver: zodResolver(SignupValidation),
    defaultValues: {
      name: '',
      username: 'test',
      email: '',
      password: ''
    }
  })

  async function onSubmit(values: z.infer<typeof SignupValidation>) {
    const newUser = await createUserAccount(values)
    if (!newUser) {
      return toast({title: 'Sign up failed. Please try again'})
    }
    const session = await signInAccount({
      email: values.email,
      password: values.password
    })
    if (!session) {

      return toast({title: 'Sign in failed. Please try again'})
    }
    const isLoggedIn = await checkAuth()
    if (isLoggedIn) {
      form.reset()
      navigate('/')
    }
    if (!isLoggedIn) {
      toast({title: 'Sign in failed. Please try again'})
    }
    console.log(newUser)
  }


  return (
    <Form {...form}>
      <div className={"sm:w-420 flex-center flex-col"}>
        <img src={'/assets/images/logo.svg'} alt={'logo'}/>
        <h2 className={'h3-bold md:h2-bold pt-5 sm:pt-12'}>Create account</h2>
        <p className={'text-light-3 small-medium md:base-regular'}>To use Snapgram enter your account details</p>


        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 flex-col gap-5 w-full mt-4">
          <FormField
            control={form.control}
            name={"name"}
            render={({field}) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input className={"shad-input"} placeholder="Name" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name={"username"}
            render={({field}) => (
              <FormItem>
                <FormLabel>User name</FormLabel>
                <FormControl>
                  <Input className={"shad-input"} placeholder="Enter username" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
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
                  <Input type={"password"} className={"shad-input"} placeholder="Enter password" {...field} />
                </FormControl>
                <FormMessage/>
              </FormItem>
            )}
          />
          <Button type="submit" variant={'outline'} className={"w-full shad-button_primary"}>
            {loadingCreateAccount ? (
              <div className={'flex-center gap-2'}>
                <Loading/>
              </div>
            ) : "Sign up"}
          </Button>
          <p>Already have an account ?
            <Link to={'/sign-in'} className={'text-primary-500 font-semibold ml-2'}>Log in</Link></p>

        </form>
      </div>

    </Form>
  );

}
export default SignupForm;