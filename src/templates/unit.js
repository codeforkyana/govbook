import React from "react"
import Layout from "../components/layout"
import UnitName from "../components/unitname"
import GovContact from "../components/govcontact"
import { FormattedMessage, Link } from "gatsby-plugin-intl"
import SEO from "../components/seo"


export default ({ pageContext }) => {
  const { contact } = pageContext
  return (
    <Layout>
      <SEO
        contact={contact}
      />
      <div className="unit-header">
        <h1>
          <UnitName {...contact} />
        </h1>
        <h2>
          <span>
            <Link to={`/?q=${encodeURIComponent(contact.County)}`}>
              <FormattedMessage id="unitLabels.county" values={{...contact}} />
            </Link>
          </span>
        </h2>
      </div>
      <div className="unit">
        <div className="unit-contact ceo-contact">
          <GovContact
            type="ceo"
            contact={contact}
            firstName={contact.CEOFName}
            lastName={contact.CEOLName}
            title={contact.CEOTitle}
            phone={contact.CEOPhone}
            ext={contact.CEOExt}
            fax={contact.CEOFax}
            email={contact.CEOEmail}
            address={contact.CEOAddr}
            city={contact.CEOCity}
            state={contact.CEOState}
            zip={contact.CEOZIP}
          />
        </div>

        <div className="unit-contact main-contact">
          <GovContact
            type="main"
            contact={contact}
            firstName={contact.FirstName}
            lastName={contact.LastName}
            title={contact.Title}
            phone={contact.Phone}
            ext={contact.Ext}
            fax={contact.Fax}
            email={contact.Email_GOV}
            address={contact.Address}
            city={contact.City}
            state={contact.State}
            zip={contact.ZIP}
          />
        </div>

        <div className="unit-contact cfo-contact">
          <GovContact
            type="cfo"
            contact={contact}
            firstName={contact.CFOFName}
            lastName={contact.CFOLName}
            title={contact.CFOTitle}
            phone={contact.CFOPhone}
            ext={contact.CFOExt}
            fax={contact.CFOFax}
            email={contact.CFOEmail}
            address={contact.CFOAddr}
            city={contact.CFOCity}
            state={contact.CFOState}
            zip={contact.CFOZIP}
          />
        </div>

        <div className="unit-contact pa-contact">
          <GovContact
            type="pa"
            contact={contact}
            firstName={contact.PAFName}
            lastName={contact.PALName}
            title={contact.PATitle}
            phone={contact.PAPhone}
            ext={contact.PAExt}
            fax={contact.PAFax}
            email={contact.PAEmail}
            address={contact.PAAddr}
            city={contact.PACity}
            state={contact.PAState}
            zip={contact.PAZIP}
          />
        </div>

        <div className="unit-contact foia-contact">
          <GovContact
            type="foia"
            contact={contact}
            firstName={contact.FOIAFName}
            lastName={contact.FOIALName}
            title={contact.FOIATitle}
            phone={contact.FOIAPhone}
            ext={contact.FOIAExt}
            fax={contact.FOIAFax}
            email={contact.FOIAEmail}
            address={contact.FOIAAddr}
            city={contact.FOIACity}
            state={contact.FOIAState}
            zip={contact.FOIAZIP}
          />
        </div>

        <div className="unit-contact tif-contact">
          <GovContact
            type="tif"
            contact={contact}
            firstName={contact.TIFFName}
            lastName={contact.TIFLName}
            title={contact.TIFTitle}
            phone={contact.TIFPhone}
            ext={contact.TIFExt}
            fax={contact.TIFFax}
            email={contact.TIFEmail}
            address={contact.TIFAddr}
            city={contact.TIFCity}
            state={contact.TIFState}
            zip={contact.TIFZIP}
          />
        </div>

      </div>
    </Layout>
  )
}
