import React from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen font-sans" style={{ backgroundColor: "#0B111E" }}>
      {/* Header */}
      <div
        className="sticky top-0 z-10 backdrop-blur-xl border-b border-white/10"
        style={{ backgroundColor: "rgba(11, 17, 30, 0.9)" }}
      >
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <Link to="/">
            <Button variant="ghost" size="icon" className="text-slate-400 hover:text-white hover:bg-white/10">
              <ArrowLeft size={20} />
            </Button>
          </Link>
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/20 rounded-lg">
              <Shield className="w-5 h-5 text-blue-400" />
            </div>
            <h1 className="text-xl font-bold text-white">Privacy Policy</h1>
          </div>
        </div>
      </div>

      {/* Content */}
      <ScrollArea className="h-[calc(100vh-73px)]">
        <div className="max-w-4xl mx-auto px-4 py-8">
          <div className="text-sm text-white font-sans space-y-4 text-left">
            <p>
              We are very pleased about your interest in our company. Data protection is of a particularly high priority
              for the management of NivoTools. Use of the NivoTools website is generally possible without providing any
              personal data. However, if a data subject wishes to use special services of our company via our website,
              the processing of personal data may become necessary. If the processing of personal data is necessary and
              there is no legal basis for such processing, we generally obtain the consent of the data subject.
            </p>
            <p>
              The processing of personal data, such as the name, address, e-mail address, or telephone number of a data
              subject, is always carried out in accordance with the General Data Protection Regulation (GDPR) and in
              accordance with the country-specific data protection regulations applicable to NivoTools. By means of this
              privacy policy, our company wishes to inform the public about the type, scope, and purpose of the personal
              data we collect, use, and process. Furthermore, data subjects are informed of their rights by means of
              this privacy policy.
            </p>
            <p>
              As the controller, NivoTools has implemented numerous technical and organizational measures to ensure the
              most complete protection of personal data processed through this website. However, internet-based data
              transmissions can fundamentally have security gaps, so absolute protection cannot be guaranteed. For this
              reason, every data subject is free to transmit personal data to us via alternative means, for example by
              telephone.
            </p>

            <h3 className="font-bold mt-6 text-lg text-blue-400">Definitions</h3>
            <p>
              The privacy policy of NivoTools is based on the terminology used by the European legislator for the
              adoption of the General Data Protection Regulation (GDPR). Our privacy policy should be easy to read and
              understand for the public as well as for our customers and business partners. To ensure this, we would
              like to explain the terminology used in advance.
            </p>
            <p>In this privacy policy, we use, among others, the following terms:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>
                <strong className="text-white">a) Personal data:</strong> Personal data means any information relating
                to an identified or identifiable natural person (hereinafter "data subject"). An identifiable natural
                person is one who can be identified, directly or indirectly, in particular by reference to an identifier
                such as a name, an identification number, location data, an online identifier, or to one or more factors
                specific to the physical, physiological, genetic, mental, economic, cultural, or social identity of that
                natural person.
              </li>
              <li>
                <strong className="text-white">b) Data subject:</strong> A data subject is any identified or
                identifiable natural person whose personal data is processed by the controller.
              </li>
              <li>
                <strong className="text-white">c) Processing:</strong> Processing is any operation or set of operations
                which is performed on personal data or on sets of personal data, whether or not by automated means, such
                as collection, recording, organization, structuring, storage, adaptation or alteration, retrieval,
                consultation, use, disclosure by transmission, dissemination or otherwise making available, alignment or
                combination, restriction, erasure or destruction.
              </li>
              <li>
                <strong className="text-white">d) Restriction of processing:</strong> Restriction of processing is the
                marking of stored personal data with the aim of limiting their processing in the future.
              </li>
              <li>
                <strong className="text-white">e) Profiling:</strong> Profiling means any form of automated processing
                of personal data consisting of the use of personal data to evaluate certain personal aspects relating to
                a natural person, in particular to analyze or predict aspects concerning that natural person's
                performance at work, economic situation, health, personal preferences, interests, reliability, behavior,
                location or movements.
              </li>
              <li>
                <strong className="text-white">f) Pseudonymization:</strong> Pseudonymization is the processing of
                personal data in such a manner that the personal data can no longer be attributed to a specific data
                subject without the use of additional information, provided that such additional information is kept
                separately and is subject to technical and organizational measures to ensure that the personal data are
                not attributed to an identified or identifiable natural person.
              </li>
              <li>
                <strong className="text-white">g) Controller or person responsible for processing:</strong> Controller
                or person responsible for processing is the natural or legal person, public authority, agency or other
                body which, alone or jointly with others, determines the purposes and means of the processing of
                personal data.
              </li>
              <li>
                <strong className="text-white">h) Processor:</strong> Processor is a natural or legal person, public
                authority, agency or other body which processes personal data on behalf of the controller.
              </li>
              <li>
                <strong className="text-white">i) Recipient:</strong> Recipient is a natural or legal person, public
                authority, agency or another body, to which the personal data are disclosed, whether a third party or
                not.
              </li>
              <li>
                <strong className="text-white">j) Third party:</strong> Third party is a natural or legal person, public
                authority, agency or body other than the data subject, controller, processor and persons who, under the
                direct authority of the controller or processor, are authorized to process personal data.
              </li>
              <li>
                <strong className="text-white">k) Consent:</strong> Consent of the data subject is any freely given,
                specific, informed and unambiguous indication of the data subject's wishes by which he or she, by a
                statement or by a clear affirmative action, signifies agreement to the processing of personal data
                relating to him or her.
              </li>
            </ul>

            <h3 className="font-bold mt-6 text-lg text-blue-400">Name and Address of the Controller</h3>
            <p>
              The controller for the purposes of the General Data Protection Regulation, other data protection laws
              applicable in the Member States of the European Union, and other provisions related to data protection is:
            </p>
            <div className="bg-slate-800/50 rounded-xl p-4 text-slate-300">
              <p>Julian Lohwasser</p>
              <p>c/o Block Services</p>
              <p>Stuttgarter Str. 106</p>
              <p>70736 Fellbach</p>
              <p>Germany</p>
              <p className="mt-2">Tel.: 015679758515</p>
              <p>Email: nivotools@bend-iq.com</p>
              <p>Website: bend-iq.com</p>
            </div>

            <h3 className="font-bold mt-6 text-lg text-blue-400">Cookies</h3>
            <p>
              The website of NivoTools uses cookies. Cookies are text files that are placed and stored on a computer
              system via an internet browser.
            </p>
            <p>
              Numerous websites and servers use cookies. Many cookies contain a so-called cookie ID. A cookie ID is a
              unique identifier of the cookie. It consists of a character string through which websites and servers can
              be assigned to the specific internet browser in which the cookie was stored. This allows visited websites
              and servers to distinguish the individual browser of the data subject from other internet browsers that
              contain other cookies. A specific internet browser can be recognized and identified via the unique cookie
              ID.
            </p>
            <p>
              Through the use of cookies, NivoTools can provide the users of this website with more user-friendly
              services that would not be possible without the setting of cookies.
            </p>
            <p>
              By means of a cookie, the information and offers on our website can be optimized with the user in mind.
              Cookies allow us, as previously mentioned, to recognize our website users. The purpose of this recognition
              is to make it easier for users to utilize our website.
            </p>
            <p>
              The data subject can prevent the setting of cookies through our website at any time by means of a
              corresponding setting of the internet browser used and thus permanently object to the setting of cookies.
              Furthermore, cookies that have already been set can be deleted at any time via an internet browser or
              other software programs. This is possible in all common internet browsers. If the data subject deactivates
              the setting of cookies in the internet browser used, not all functions of our website may be fully usable.
            </p>

            <h3 className="font-bold mt-6 text-lg text-blue-400">Collection of General Data and Information</h3>
            <p>
              The website of NivoTools collects a series of general data and information when a data subject or
              automated system calls up the website. This general data and information are stored in the server log
              files. The following may be collected: (1) browser types and versions used, (2) the operating system used
              by the accessing system, (3) the website from which an accessing system reaches our website (so-called
              referrers), (4) the sub-websites accessed via an accessing system on our website, (5) the date and time of
              access to the website, (6) an internet protocol address (IP address), (7) the internet service provider of
              the accessing system, and (8) any other similar data and information that may be used in the event of
              attacks on our information technology systems.
            </p>
            <p>
              When using these general data and information, NivoTools does not draw any conclusions about the data
              subject. Rather, this information is needed to (1) deliver the content of our website correctly, (2)
              optimize the content of our website as well as its advertisement, (3) ensure the long-term viability of
              our information technology systems and website technology, and (4) provide law enforcement authorities
              with the information necessary for criminal prosecution in case of a cyber-attack.
            </p>

            <h3 className="font-bold mt-6 text-lg text-blue-400">Registration on Our Website</h3>
            <p>
              The data subject has the possibility to register on the website of the controller with the indication of
              personal data. Which personal data are transmitted to the controller is determined by the respective input
              mask used for the registration. The personal data entered by the data subject are collected and stored
              exclusively for internal use by the controller and for its own purposes.
            </p>
            <p>
              By registering on the website of the controller, the IP address—assigned by the internet service provider
              (ISP) and used by the data subject—date, and time of the registration are also stored. The storage of this
              data takes place against the background that this is the only way to prevent the misuse of our services,
              and, if necessary, to make it possible to investigate committed offenses.
            </p>
            <p>
              The registration of the data subject, with the voluntary indication of personal data, is intended to
              enable the controller to offer the data subject contents or services that may only be offered to
              registered users due to the nature of the matter in question. Registered persons are free to change the
              personal data specified during the registration at any time, or to have them completely deleted from the
              data stock of the controller.
            </p>
            <p>
              The data controller shall, at any time, provide information upon request to each data subject as to what
              personal data are stored about the data subject. In addition, the data controller shall correct or erase
              personal data at the request or indication of the data subject, insofar as there are no statutory storage
              obligations.
            </p>

            <h3 className="font-bold mt-6 text-lg text-blue-400">Routine Erasure and Blocking of Personal Data</h3>
            <p>
              The data controller shall process and store the personal data of the data subject only for the period
              necessary to achieve the purpose of storage, or as far as this is granted by the European legislator or
              other legislators in laws or regulations to which the controller is subject.
            </p>
            <p>
              If the storage purpose is not applicable, or if a storage period prescribed by the European legislator or
              another competent legislator expires, the personal data are routinely blocked or erased in accordance with
              legal requirements.
            </p>

            <h3 className="font-bold mt-6 text-lg text-blue-400">Rights of the Data Subject</h3>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>
                <strong className="text-white">a) Right of confirmation:</strong> Each data subject shall have the right
                granted by the European legislator to obtain from the controller the confirmation as to whether or not
                personal data concerning him or her are being processed.
              </li>
              <li>
                <strong className="text-white">b) Right of access:</strong> Each data subject shall have the right
                granted by the European legislator to obtain from the controller free information about his or her
                personal data stored at any time and a copy of this information. Furthermore, the European directives
                and regulations grant the data subject access to information about the purposes of the processing, the
                categories of personal data concerned, and the recipients or categories of recipients.
              </li>
              <li>
                <strong className="text-white">c) Right to rectification:</strong> Each data subject shall have the
                right granted by the European legislator to obtain from the controller without undue delay the
                rectification of inaccurate personal data concerning him or her.
              </li>
              <li>
                <strong className="text-white">d) Right to erasure (Right to be forgotten):</strong> Each data subject
                shall have the right granted by the European legislator to obtain from the controller the erasure of
                personal data concerning him or her without undue delay, and the controller shall have the obligation to
                erase personal data without undue delay where one of the following grounds applies: the personal data
                are no longer necessary in relation to the purposes for which they were collected; the data subject
                withdraws consent; the data subject objects to the processing; the personal data have been unlawfully
                processed; or the personal data must be erased for compliance with a legal obligation.
              </li>
              <li>
                <strong className="text-white">e) Right to restriction of processing:</strong> Each data subject shall
                have the right granted by the European legislator to obtain from the controller restriction of
                processing where the accuracy of the personal data is contested, the processing is unlawful, or the
                controller no longer needs the personal data for the purposes of the processing.
              </li>
              <li>
                <strong className="text-white">f) Right to data portability:</strong> Each data subject shall have the
                right granted by the European legislator to receive the personal data concerning him or her, which was
                provided to a controller, in a structured, commonly used and machine-readable format.
              </li>
              <li>
                <strong className="text-white">g) Right to object:</strong> Each data subject shall have the right
                granted by the European legislator to object, on grounds relating to his or her particular situation, at
                any time, to processing of personal data concerning him or her.
              </li>
              <li>
                <strong className="text-white">h) Automated individual decision-making, including profiling:</strong>{" "}
                Each data subject shall have the right granted by the European legislator not to be subject to a
                decision based solely on automated processing, including profiling, which produces legal effects
                concerning him or her.
              </li>
              <li>
                <strong className="text-white">i) Right to withdraw data protection consent:</strong> Each data subject
                shall have the right granted by the European legislator to withdraw his or her consent to processing of
                his or her personal data at any time.
              </li>
            </ul>

            <h3 className="font-bold mt-6 text-lg text-blue-400">
              Data Protection Provisions about Google AdSense, Analytics, Remarketing & AdWords
            </h3>
            <p>
              The controller has integrated Google AdSense on this website. Google AdSense is an online service which
              allows the placement of advertising on third-party sites. Google AdSense is based on an algorithm that
              selects advertisements displayed on third-party sites to match with the content of the respective
              third-party site.
            </p>
            <p>
              The controller has integrated the component of Google Analytics (with the anonymization function) on this
              website. Google Analytics is a web analytics service. Web analytics is the collection, gathering, and
              analysis of data about the behavior of visitors to websites. For the web analytics through Google
              Analytics, the controller uses the application "_gat._anonymizeIp". By means of this application, the IP
              address of the internet connection of the data subject is abridged by Google and anonymized when accessing
              our websites from a Member State of the European Union.
            </p>
            <p>
              The controller has also integrated Google Remarketing services on this website. Google Remarketing is a
              feature of Google AdWords that allows an enterprise to display advertising to internet users who have
              previously resided on the enterprise's website.
            </p>
            <p>
              The operating company of these Google services is Google Ireland Limited, Gordon House, Barrow Street,
              Dublin, D04 E5W5, Ireland.
            </p>

            <h3 className="font-bold mt-6 text-lg text-blue-400">Legal Basis for Processing</h3>
            <p>
              Art. 6(1) lit. a GDPR serves as the legal basis for processing operations for which we obtain consent for
              a specific processing purpose. If the processing of personal data is necessary for the performance of a
              contract to which the data subject is party, the processing is based on Article 6(1) lit. b GDPR. The same
              applies to such processing operations which are necessary for carrying out pre-contractual measures. Is
              our company subject to a legal obligation by which processing of personal data is required, such as for
              the fulfillment of tax obligations, the processing is based on Art. 6(1) lit. c GDPR. In rare cases, the
              processing of personal data may be necessary to protect the vital interests of the data subject or of
              another natural person (Art. 6(1) lit. d GDPR). Finally, processing operations could be based on Article
              6(1) lit. f GDPR.
            </p>

            <h3 className="font-bold mt-6 text-lg text-blue-400">
              Legitimate Interests Pursued by the Controller or by a Third Party
            </h3>
            <p>
              Where the processing of personal data is based on Article 6(1) lit. f GDPR, our legitimate interest is to
              carry out our business in favor of the well-being of all our employees and the shareholders.
            </p>

            <h3 className="font-bold mt-6 text-lg text-blue-400">Period for Which the Personal Data Will Be Stored</h3>
            <p>
              The criteria used to determine the period of storage of personal data is the respective statutory
              retention period. After expiration of that period, the corresponding data is routinely deleted, as long as
              it is no longer necessary for the fulfillment of the contract or the initiation of a contract.
            </p>

            <h3 className="font-bold mt-6 text-lg text-blue-400">
              Provision of Personal Data as Statutory or Contractual Requirement
            </h3>
            <p>
              We clarify that the provision of personal data is partly required by law (e.g. tax regulations) or can
              also result from contractual provisions (e.g. information on the contractual partner). Sometimes it may be
              necessary to conclude a contract that the data subject provides us with personal data, which must
              subsequently be processed by us. The data subject is, for example, obliged to provide us with personal
              data when our company signs a contract with him or her. The non-provision of the personal data would have
              the consequence that the contract with the data subject could not be concluded.
            </p>

            <h3 className="font-bold mt-6 text-lg text-blue-400">Existence of Automated Decision-Making</h3>
            <p>As a responsible company, we do not use automatic decision-making or profiling.</p>

            <h3 className="font-bold mt-6 text-lg text-blue-400">Hosting by IONOS</h3>
            <p>We host our website with the following provider:</p>
            <div className="bg-slate-800/50 rounded-xl p-4 text-slate-300 my-4">
              <p>IONOS SE</p>
              <p>Elgendorfer Str. 57</p>
              <p>56410 Montabaur</p>
              <p>Germany</p>
            </div>
            <p>
              <strong className="text-white">Nature and Purpose of Processing:</strong> The hoster processes personal data (e.g., IP addresses, technical usage data) to provide us with infrastructure and platform services, computing capacity, storage space, database services, security services, and technical maintenance services used for the purpose of operating this online offering.
            </p>
            <p className="mt-4">
              <strong className="text-white">Legal Basis:</strong> The use of the hoster is for the purpose of contract fulfillment towards our potential and existing customers (Art. 6 (1) (b) GDPR) and in the interest of a secure, fast, and efficient provision of our online offering by a professional provider (Art. 6 (1) (f) GDPR).
            </p>
            <p className="mt-4">
              <strong className="text-white">Conclusion of a Data Processing Agreement (DPA):</strong> In order to ensure processing in compliance with data protection regulations, we have concluded a Data Processing Agreement with the provider mentioned above.
            </p>

            <h3 className="font-bold mt-6 text-lg text-blue-400">Use of Median (App Wrapper)</h3>
            <p>
              We use the service Median (GoNative.io LLC, USA) to provide our mobile application. Median allows us to
              deliver our web application as a native app for mobile devices. When accessing the app via the APK/App
              interface, technical data (e.g., IP address, browser type, device operating system) is transmitted to
              Median's servers to ensure the functionality and stability of the app shell. This constitutes a legitimate
              interest pursuant to Art. 6 (1) lit. f GDPR. For the transfer of data to the USA, the provider uses
              Standard Contractual Clauses (SCCs) of the EU Commission.
            </p>

            <h3 className="font-bold mt-6 text-lg text-blue-400">
              Data Protection Provisions for Google Firebase (Authentication & Firestore)
            </h3>
            <p>
              The controller has integrated components of Google Firebase on this website. Firebase is a platform from
              Google for developing web and mobile applications.
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>
                <strong className="text-white">Authentication:</strong> We use Firebase Authentication to identify and
                manage user accounts. Personal data such as email addresses and user IDs are processed for the purpose
                of authentication.
              </li>
              <li>
                <strong className="text-white">Firestore:</strong> We use Firestore for cloud-based storage and
                synchronization of project data (bending values and app-specific settings). Project data is stored on
                Google servers.
              </li>
              <li>
                <strong className="text-white">Third-country transfer:</strong> The use of Google Firebase involves the
                transfer of data to the United States of America. Google uses standard contractual clauses approved by
                the European Commission for this purpose, which represent an appropriate guarantee for the security of
                data transfer to third countries.
              </li>
            </ul>

            <h3 className="font-bold mt-6 text-lg text-blue-400">Use of Device Sensors (Gyroscope & Camera)</h3>
            <p>The BendIQ app uses specific hardware components of your end device to provide technical functions:</p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>
                <strong className="text-white">Gyroscope:</strong> Angle measurement is performed via the motion sensors
                built into the end device. The processing of this sensor data takes place exclusively locally on your
                end device and serves the real-time display of the inclination angle. No storage or transmission of this
                movement data to external servers takes place.
              </li>
              <li>
                <strong className="text-white">Camera/Light:</strong> Activating the flashlight requires access to the
                camera unit. The app exclusively uses the flash/light element; no image data is captured, stored, or
                transmitted.
              </li>
            </ul>

            <h3 className="font-bold mt-6 text-lg text-blue-400">Use of Local Storage (Extended Cookie Definition)</h3>
            <p>
              In addition to cookies, this website uses the browser's "Local Storage" to store functional app data on
              the user's end device. Information that remains without a server connection is stored in the local
              storage, including:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-slate-300">
              <li>Design mode (Dark/Light)</li>
              <li>Progress and rotation of motivational messages</li>
              <li>Progress and rotation of question of the day</li>
              <li>Progress of terms and questions</li>
            </ul>

            <h3 className="font-bold mt-6 text-lg text-blue-400">Data Security (Encryption)</h3>
            <p>
              To secure the transmitted information, this website uses SSL or TLS encryption (HTTPS). This encryption
              protects the data transmission between the app interface and the Google Firebase database from
              unauthorized access by third parties.
            </p>

            <p className="text-xs text-slate-500 mt-8 pt-4 border-t border-slate-800">
              This privacy policy was created by the Privacy Policy Generator of the DGD Deutsche Gesellschaft für
              Datenschutz GmbH, acting as External Data Protection Officer Munich, in cooperation with the Cologne IT
              and data protection lawyer Christian Solmecke.
            </p>
          </div>
        </div>
      </ScrollArea>
    </div>
  );
};

export default PrivacyPolicy;
