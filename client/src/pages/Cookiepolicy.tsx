import Navbar from "@/components/layout/navbar";
import Footer from "@/components/layout/footer";

export default function CookiePolicyPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      
      <main className="flex-grow">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white sm:text-4xl mb-8">Cookie Policy</h1>
          
          <div className="prose prose-indigo max-w-none dark:prose-invert">
            <p className="lead text-lg text-gray-600 dark:text-gray-400">
              Last Updated: April 6, 2023
            </p>
            
            <h2>What Are Cookies</h2>
            <p>
              As is common practice with almost all professional websites, Nivalus Bank uses cookies, which are tiny files that are downloaded to your computer, to improve your experience. This page describes what information they gather, how we use it, and why we sometimes need to store these cookies. We will also share how you can prevent these cookies from being stored, however, this may downgrade or 'break' certain elements of the site's functionality.
            </p>
            
            <h2>How We Use Cookies</h2>
            <p>
              We use cookies for a variety of reasons detailed below. Unfortunately, in most cases, there are no industry standard options for disabling cookies without completely disabling the functionality and features they add to this site. It is recommended that you leave all cookies if you are not sure whether you need them or not in case they are used to provide a service that you use.
            </p>
            
            <h2>The Cookies We Set</h2>
            
            <h3>Account Related Cookies</h3>
            <p>
              If you create an account with us, we will use cookies for the management of the signup process and general administration. These cookies will usually be deleted when you log out, however in some cases they may remain afterward to remember your site preferences when logged out.
            </p>
            
            <h3>Login Related Cookies</h3>
            <p>
              We use cookies when you are logged in so that we can remember this fact. This prevents you from having to log in every single time you visit a new page. These cookies are typically removed or cleared when you log out to ensure that you can only access restricted features and areas when logged in.
            </p>
            
            <h3>Forms Related Cookies</h3>
            <p>
              When you submit data through a form such as those found on contact pages or comment forms, cookies may be set to remember your user details for future correspondence.
            </p>
            
            <h3>Site Preferences Cookies</h3>
            <p>
              In order to provide you with a great experience on this site, we provide the functionality to set your preferences for how this site runs when you use it. In order to remember your preferences, we need to set cookies so that this information can be called whenever you interact with a page that is affected by your preferences.
            </p>
            
            <h2>Third-Party Cookies</h2>
            <p>
              In some special cases, we also use cookies provided by trusted third parties. The following section details which third-party cookies you might encounter through this site.
            </p>
            
            <ul>
              <li>
                This site uses Google Analytics, one of the most widespread and trusted analytics solutions on the web, to help us understand how you use the site and ways that we can improve your experience. These cookies may track things such as how long you spend on the site and the pages that you visit so we can continue to produce engaging content.
              </li>
              <li>
                From time to time, we test new features and make subtle changes to the way that the site is delivered. When we are still testing new features, these cookies may be used to ensure that you receive a consistent experience while on the site while ensuring we understand which optimizations our users appreciate the most.
              </li>
              <li>
                We also use social media buttons and/or plugins on this site that allow you to connect with your social network in various ways. For these to work, social media sites including Facebook, Twitter, and LinkedIn will set cookies through our site which may be used to enhance your profile on their site or contribute to the data they hold for various purposes outlined in their respective privacy policies.
              </li>
            </ul>
            
            <h2>Controlling Cookies</h2>
            <p>
              You can prevent the setting of cookies by adjusting the settings on your browser (see your browser Help for how to do this). Be aware that disabling cookies will affect the functionality of this and many other websites that you visit. Disabling cookies will usually result in also disabling certain functionality and features of this site. Therefore, it is recommended that you do not disable cookies.
            </p>
            
            <h2>More Information</h2>
            <p>
              Hopefully, that has clarified things for you, and as was previously mentioned, if there is something that you aren't sure whether you need or not, it's usually safer to leave cookies enabled in case it does interact with one of the features you use on our site.
            </p>
            
            <p>
              If you are still looking for more information, you can contact us through one of our preferred contact methods:
            </p>
            
            <ul>
              <li>Email: privacy@nivalusbank.com</li>
              <li>Phone: +1 (800) 123-4567</li>
              <li>Mail: Privacy Office, Nivalus Bank, One Financial Plaza, New York, NY 10004, United States</li>
            </ul>
            
            <p>
              We prioritize your privacy and are committed to ensuring that your online banking experience is secure and personalized.
            </p>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}