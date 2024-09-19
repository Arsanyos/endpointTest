import Image from "next/image";
import { Input } from "@/components/Input";
//
import { menuItems } from "@/constants/constants";

function Layout({ children }: { children: React.ReactNode }) {
    return (
        <main className="relative min-h-screen flex flex-col justify-between p-4">
            {/* top nav */}
            <div className="sticky top-0 z-10 bg-white flex flex-col gap-2 py-2">
                <p className="font-bold text-2xl">What would you like to order?</p>
                <div className="flex flex-row items-center gap-2">
                    <Input type="Search" />
                    <Image alt="sorting-icon" src="/sort.svg" height={24} width={24} />
                </div>
                <div className="flex flex-row justify-around my-2 h-20 w-full">
                    {
                        menuItems.map((menuNavItem, index) => {
                            return (
                                <div key={index} className="flex flex-col gap-2 items-center  border-4 border-gray-300 rounded-full p-1 w-12 shadow-xl">
                                    <div className="h-[50%] relative w-full">
                                        <Image alt="sorting-icon" src={menuNavItem.icon} fill style={{ objectFit: "contain" }} />
                                    </div>
                                    <p className="text-xs h-auto text-wrap w-[100%]">{menuNavItem.name}</p>
                                </div>
                            )
                        })
                    }

                </div>
            </div>

            {/* content */}
            <div className="flex-1 -z-10">{children}</div>
        </main>
    );
}

export default Layout;
