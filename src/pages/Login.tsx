
import AuthForm from "@/components/AuthForm";

interface LoginProps {
  onLogin: (email: string, password: string) => void;
}

const Login = ({ onLogin }: LoginProps) => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <AuthForm onLogin={onLogin} />
    </div>
  );
};

export default Login;
