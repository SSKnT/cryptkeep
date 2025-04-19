import AuthForm from "@/components/auth/authForms";
import Header from "@/components/header.js";

export default function Authentication() {
  return (
      <div className={`flex flex-col min-h-screen w-full bg-background dark:bg-background overflow-x-hidden`}>
        <Header />
        <main className="flex flex-col h-full w-full pt-5">
            <AuthForm />
        </main>
      </div>
  );
}
