import BitcoinContent from "./BitcoinContent";
import prisma from "@/client";
import BonusFilter from "../../components/functions/bonusfilter";
import CasinoDisplayList from "../../components/CasinoDisplayList";
/*

      OR: [
        { currencies: { contains: "4" } },

        { currencies: { contains: "6" } },
      ],
*/
async function getCasinos() {
  const data = await prisma.casino_p_casinos.findMany({
    where: {
      approved: 1,
      rogue: 0,
      currencies: { contains: "BTC" },
    },

    distinct: ["id"],
    select: {
      id: true,
      clean_name: true,
      casino: true,
      hot: true,
      new: true,
      button: true,
      bonuses: {
        orderBy: [{ deposit: "desc" }, { nodeposit: "desc" }],
      },
    },
    orderBy: [{ hot: "desc" }, { new: "desc" }],
    take: 10,
  });
  const bdata: any[] = data.filter((p) => p.bonuses.length > 0);
  const bonus = BonusFilter(bdata);
  return bonus;
}
export default async function Nodeposit() {
  const casinos = await getCasinos();

  console.log(casinos)
  return (
    
    <BitcoinContent data = {casinos}/>
  );
}

export const metadata = {
  title:
    "Bitcoin Casinos :: Complete guide to playing online casinos that offer Bitcoin or other Crypto Currencies",
  description:
    "The new preferred way to play online casinos is with the use of Bitcoin or other mainstream crypto currencies.  Allfreechips has reviewed may Bitcoin casinos here.",
};
