import PoringGone from 'assets/images/poring_gone.png'
import PoringGood from 'assets/images/poring_good.png'
import PoringHit from 'assets/images/poring_hit.png'


export default function ImgPoring({ state = 1 }: { state?: number }): JSX.Element {
    switch (state) {
        case 0:
            return <img src={PoringHit} className="inline-block" alt="fail" />
        case -1:
            return <img src={PoringGone} className="inline-block" alt="worst" />
        default:
            return <img src={PoringGood} className="inline-block" alt="good" />
    }
}