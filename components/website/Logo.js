import Image from "next/image";
import Link from "next/link";
export default function Logo() {
  return <Link href="/" prefetch={true} className="stayvo-logo" aria-label="Stayvo Kochi home"><span className="stayvo-logo-mark"><Image src="/images/stayvo/logo-mark.png" alt="Stayvo Kochi logo" width={64} height={64} sizes="64px" loading="eager" /></span><span><strong>STAYVO</strong><small>KOCHI <span>·</span> BY MAPARANI GROUP</small></span></Link>;
}
