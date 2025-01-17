import { Button, Typography } from "@material-tailwind/react";
import { Card, CardBody, CardFooter, CardHeader } from "@material-tailwind/react";

export default function ProductSkeleton() {
  return (
    <Card
      className=" animate-pulse aspect-[4/5] flex flex-col items-center p-2"
      placeholder={undefined}
      onPointerEnterCapture={undefined}
      onPointerLeaveCapture={undefined}
    >
      <CardHeader
        shadow={false}
        floated={false}
        className="relative grid m-0   place-items-center bg-gray-300 w-[90%] aspect-square object-cover rounded-xl"
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={2}
          stroke="currentColor"
          className="h-12 w-12 text-gray-500"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
      </CardHeader>
      <CardBody
        placeholder={undefined}
        onPointerEnterCapture={undefined}
        onPointerLeaveCapture={undefined}
        className="p-0 w-full pt-5"
      >
        <Typography
          as="div"
          variant="h1"
          className="mb-1 h-4 w-full rounded-full bg-gray-300"
          placeholder={undefined}
        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="h1"
          className="mb-1 h-2 w-full rounded-full bg-gray-300"
          placeholder={undefined}
        >
          &nbsp;
        </Typography>
        <Typography
          as="div"
          variant="h1"
          className="mb-1 h-2 w-full rounded-full bg-gray-300"
          placeholder={undefined}
        >
          &nbsp;
        </Typography>
      </CardBody>
    </Card>
  );
}
