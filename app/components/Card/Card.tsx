import { Link } from '@remix-run/react';
import { getCustomFields } from '~/data';

export const Card: React.FC<{
  isCurrent: boolean, successor: any
}> = ({successor, isCurrent}) => {
  const { ID, custom_fields, post_name } = successor;
  return (
    <Link  key={ID} to={`/member/${post_name}`}>
      <article className={`card ${isCurrent?"card--active":""}`}>
        {getCustomFields(custom_fields, "User Profile Picture")
          ?<img className="card__image" src={`${getCustomFields(custom_fields, "User Profile Picture")}`} />
          :""
        }
        <div>
          <div className="card__title">
            {`${getCustomFields(custom_fields, "User Title")}
              ${getCustomFields(custom_fields, "User First Name")}
              ${getCustomFields(custom_fields, "User Last Name")}
              ${getCustomFields(custom_fields, "User Suffix")}
            `}
          </div>
          <div className="card__subtitle">
            {getCustomFields(custom_fields, "User Relationship")||getCustomFields(custom_fields, "User Membership Type")+" Member"}
          </div>
          <p className="card__text">
          {getCustomFields(custom_fields, "User DOB").split("/").at(-1)} - {getCustomFields(successor.custom_fields, "User DOD").split("/").at(-1)}
          </p>
          <p className="card__text">
            Admitted {getCustomFields(successor.custom_fields, "User Year Admitted")}
          </p>
        </div>
      </article>
    </Link>
  )
}