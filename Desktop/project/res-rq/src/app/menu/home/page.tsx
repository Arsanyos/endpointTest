import Image from "next/image"

import { AspectRatio } from "@/components/ui/aspect-ratio"
import { Badge } from "@/components/ui/badge"

function MenuHome() {
    return (
        <div className="flex flex-col gap-4">
            {/* home banner */}
            <div className="relative w-full">
                <AspectRatio ratio={21 / 9} className="absolute z-1">
                    <Image src="/background/homeBanner.svg" alt="bannerImage" className="rounded-md object-cover" fill />
                </AspectRatio>
                <div className="absolute -z-1 top-8 left-2 flex flex-col gap-2 items-center w-[40%]">
                    <p className="text-white text-center text-sm">Experience our delicious new dish</p>
                    <h3 className="text-white font-bold text-2xl">30% OFF</h3>
                </div>
            </div>

            <div className="h-1 w-[90%] mx-auto bg-red-100"></div>
            {/* bet sellers */}
            <div className="w-full flex flex-col gap-4 items-start mb-4">
                <div className="flex flex-row justify-between w-full">
                    <span className="text-xl">Best Seller</span>
                    <span className="text-primary font-semibold">View All  {'>'}</span>
                </div>
                <div className="flex flex-row gap-2 ">
                    <div className="relative h-[150px] w-[100px]">
                        <p className="absolute bottom-4 right-0 z-10 bg-primary p-.5 px-1 rounded-md text-white">400 Birr</p>
                        <div className="h-full w-full -z-10">
                            <Image
                                src="/background/burger.svg"
                                alt="burger-best-seller"
                                fill
                                className="objet-fill"
                            />
                        </div>
                    </div>
                    <div className="relative h-[150px] w-[100px]">
                        <p className="absolute bottom-4 right-0 z-10 bg-primary p-.5 px-1 rounded-md text-white">400 Birr</p>
                        <div className="h-full w-full -z-10">
                            <Image
                                src="/background/chicken-curry.svg"
                                alt="burger-best-seller"
                                fill
                                className="objet-fill"
                            />
                        </div>
                    </div>
                    <div className="relative h-[150px] w-[100px]">
                        <p className="absolute bottom-4 right-0 z-10 bg-primary p-.5 px-1 rounded-md text-white">400 Birr</p>
                        <div className="h-full w-full -z-10">
                            <Image
                                src="/background/burger.svg"
                                alt="burger-best-seller"
                                fill
                                className="objet-fill"
                            />
                        </div>
                    </div>

                </div>
            </div>
            {/* recomndations */}
            <div className="flex flex-col items-start gap-2 w-full h-[180px] mb-20 ">
                <div className="flex flex-row justify-between w-full">
                    <span className="text-xl">Recommend</span>
                </div>
                <div className="flex flex-row gap-2 w-full h-full ">
                    <div className="relative w-[50%] h-full">
                        <Badge className="absolute z-10 top-2 left-2">5.0</Badge>
                        <AspectRatio ratio={1} className="absolute -z-10 w-full h-full ">
                            <Image src="/background/burger.svg" alt="bannerImage" className="rounded-md object-cover rounded-xl" fill />
                        </AspectRatio>
                    </div>

                    <div className="relative w-[50%] h-full">
                        <Badge className="absolute z-10 top-2 left-2">5.0</Badge>
                        <AspectRatio ratio={1} className="absolute -z-10 w-full h-full ">
                            <Image src="/background/burger.svg" alt="bannerImage" className="rounded-md object-cover rounded-xl " fill />
                        </AspectRatio>
                    </div>
                </div>
            </div>
        </div>
    )
}
export default MenuHome