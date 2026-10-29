import { SparkIcon, StarMark } from './Icons';

interface OnboardingProps {
  onDone: () => void;
}

export function Onboarding({ onDone }: OnboardingProps) {
  return (
    <div className="overlay onboarding-overlay">
      <section className="onboarding" role="dialog" aria-modal="true" aria-labelledby="welcome-title">
        <div className="onboarding-mark" aria-hidden="true">
          <span className="onboarding-orbit" />
          <StarMark size={54} />
        </div>
        <p className="eyebrow">WELCOME TO GLIMMER</p>
        <h1 id="welcome-title">把日子，过成星河。</h1>
        <p className="onboarding-lead">
          微光是一个只属于你的微记录空间。
          <br />
          每天一句话，慢慢长成一片私人星空。
        </p>

        <ol className="onboarding-steps">
          <li>
            <span>01</span>
            <div>
              <b>点亮</b>
              <p>写下一个此刻的念头、心情，或一件小事。</p>
            </div>
          </li>
          <li>
            <span>02</span>
            <div>
              <b>回望</b>
              <p>点击星图里的任意一颗星，和旧时光重逢。</p>
            </div>
          </li>
          <li>
            <span>03</span>
            <div>
              <b>带走</b>
              <p>用一段星语码，把整片星空搬到另一台设备。</p>
            </div>
          </li>
        </ol>

        <button type="button" className="btn btn-primary onboarding-start" onClick={onDone}>
          <SparkIcon size={16} />
          开始点亮
        </button>
        <p className="onboarding-foot">无账号 · 无云端 · 没有算法替你记住</p>
      </section>
    </div>
  );
}
