function AuthPage({children}:{children:React.ReactNode}) {
    return (
        <main className="bg-[url('https://zagblogmedia.s3.amazonaws.com/wp-content/uploads/2020/02/10140728/viagem-a-trabalho-scaled.jpg')] bg-no-repeat bg-cover flex min-h-screen flex-col items-center justify-center">
            <form className="flex flex-col bg-white px-6 py-14 rounded-2xl gap-11 text-gray-600 w-1/4">
                {children}
            </form>
        </main>
    );
}

export default AuthPage;
