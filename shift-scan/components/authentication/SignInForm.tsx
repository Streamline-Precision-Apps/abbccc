import { z } from "zod";
interface Props {
    callbackUrl?: string;
}
const FormSchema = z.object({
    username: z.string().email("Please enter a valid email address"),
    password: z.string({
        required_error: "Please enter a password",
    }),
});
type InputType = z.infer<typeof FormSchema>;

const SignInForm = (props: Props) => {
    const {register, handleSubmit} = useForm<InputType>({
        resolver: zodResolver(FormSchema),
    })
    return <form className="flex flex-col gap-2">
        <Input label= "username" type="text" {...register("email")} errorMessage={} />
    </form>
}

export default SignInForm