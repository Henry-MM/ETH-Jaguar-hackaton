import { useReadContract, useWriteContract } from "wagmi";
import { abi as LempiraCoinAbi } from "../smartContracts/LempiraCoin.json";
import { abi as PrestamigoAbi } from "../smartContracts/Prestamigo.json";
import { abi as LoansAbi } from "../smartContracts/Loans.json";

export default function Test() {
   const { data, writeContract, isPending, isError, error } = useWriteContract();
   // const { isLoading, error } = useReadContract({
   //    address: import.meta.env.VITE_PRESTAMIGO_CONTRACT_ADDRESS as `0x${string}`,
   //    abi: PrestamigoAbi,
   //    functionName: "maxLoanAmount",
   // });

   async function send() {
      writeContract({
         address: import.meta.env.VITE_PRESTAMIGO_CONTRACT_ADDRESS as `0x${string}`,
         abi: PrestamigoAbi,
         functionName: "createLoan",
         args: [500 * 18 ** 18, 10, false],
      });
   }

   console.log(data);

   return (
      <div>
      
         <button onClick={send}>enviar</button>
         <p>{data}</p>
         <p>{isPending ? "Loading..." : "Loaded"}</p>
         <p>{isError ? error.message : "No Error"}</p>
      </div>
   );
}
