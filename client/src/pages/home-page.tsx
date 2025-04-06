import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import Footer from "@/components/layout/footer";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, DollarSign, Shield, Leaf, ChevronDown, Target, BarChart, Gift } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
          {/* Animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <motion.div 
              className="absolute top-10 right-10 w-64 h-64 rounded-full bg-primary-100 dark:bg-primary-900/20 opacity-70"
              animate={{ 
                scale: [1, 1.2, 1],
                x: [0, 20, 0],
                y: [0, 10, 0],
              }}
              transition={{ 
                duration: 15,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
            <motion.div 
              className="absolute bottom-10 left-10 w-80 h-80 rounded-full bg-secondary-100 dark:bg-secondary-900/20 opacity-60"
              animate={{ 
                scale: [1, 1.1, 1],
                x: [0, -10, 0],
                y: [0, 20, 0],
              }}
              transition={{ 
                duration: 12,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            />
          </div>

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-28 md:py-36 relative z-10">
            <div className="flex flex-col lg:flex-row items-center justify-between gap-12">
              <motion.div 
                className="max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
              >
                <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white sm:text-5xl lg:text-6xl tracking-tight leading-tight">
                  The <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary-500 to-secondary-500">Future</span> of Banking 
                  <br />Is Here
                </h1>
                <p className="mt-6 text-xl text-gray-600 dark:text-gray-300 leading-relaxed">
                  Experience seamless, secure, and sustainable banking for a new generation.
                  Join thousands of customers who have modernized their financial life.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/auth?tab=signup">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button size="lg" className="rounded-full shadow-lg shadow-primary-500/20 px-8">
                        Get Started <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/auth">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" size="lg" className="rounded-full px-8">
                        Sign In
                      </Button>
                    </motion.div>
                  </Link>
                </div>
                
                <div className="mt-10 flex items-center gap-6">
                  <div className="flex -space-x-2">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className={`w-8 h-8 rounded-full border-2 border-white dark:border-gray-800 bg-primary-${i*100}`} />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    <span className="font-bold">10,000+</span> customers already trust us
                  </p>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative w-full max-w-md"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
              >
                <div className="relative bg-white dark:bg-gray-850 rounded-2xl shadow-2xl overflow-hidden">
                  <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-r from-primary-500 to-secondary-500" />
                  <div className="relative z-10 pt-16 pb-8 px-8">
                    <div className="flex justify-between items-center mb-6">
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Current Balance</p>
                        <h3 className="text-2xl font-bold text-gray-900 dark:text-white">$12,348.00</h3>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                        <CreditCard className="text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400">
                              <DollarSign className="w-5 h-5" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Income</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Today, 2:35 PM</p>
                            </div>
                          </div>
                          <p className="text-green-600 dark:text-green-400 font-medium">+$250.00</p>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
                              <CreditCard className="w-5 h-5" />
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">Purchase</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Yesterday, 11:20 AM</p>
                            </div>
                          </div>
                          <p className="text-red-600 dark:text-red-400 font-medium">-$42.50</p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <Button variant="outline" className="w-full rounded-xl" size="lg">
                        View All Transactions
                      </Button>
                    </div>
                  </div>
                </div>
                
                <motion.div 
                  className="absolute -bottom-5 -right-5 w-24 h-24 bg-secondary-100 dark:bg-secondary-900/50 rounded-2xl rotate-12"
                  animate={{ 
                    rotate: [12, 5, 12],
                    y: [0, 10, 0],
                  }}
                  transition={{ 
                    duration: 6,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
                <motion.div 
                  className="absolute -top-5 -left-5 w-16 h-16 bg-primary-100 dark:bg-primary-900/50 rounded-full"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    x: [0, 10, 0],
                  }}
                  transition={{ 
                    duration: 8,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }}
                />
              </motion.div>
            </div>
            
            <motion.div 
              className="absolute bottom-5 left-1/2 transform -translate-x-1/2 hidden md:block"
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ 
                duration: 1,
                delay: 1.5,
                repeat: Infinity,
                repeatType: "reverse"
              }}
            >
              <Button variant="ghost" size="sm" className="rounded-full">
                <ChevronDown className="w-5 h-5" />
                <span className="sr-only">Scroll down</span>
              </Button>
            </motion.div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white dark:bg-gray-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block rounded-full bg-primary-100 dark:bg-primary-900/30 px-3 py-1 text-sm font-medium text-primary-800 dark:text-primary-300 mb-4">
                Our Services
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Smart Banking for the Modern World
              </h2>
              <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                Experience the next generation of banking with features designed for your digital lifestyle.
              </p>
            </motion.div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: "Instant Transfers",
                  description: "Send money instantly to friends, family, or businesses - all with zero fees between users.",
                  icon: <ArrowRight className="h-6 w-6" />,
                  color: "primary",
                  delay: 0
                },
                {
                  title: "Smart Budgeting",
                  description: "Track your spending habits with AI-powered insights and personalized recommendations.",
                  icon: <BarChart className="h-6 w-6" />,
                  color: "secondary",
                  delay: 0.1
                },
                {
                  title: "Ultra Security",
                  description: "Rest easy with bank-grade encryption, biometric authentication, and fraud monitoring.",
                  icon: <Shield className="h-6 w-6" />,
                  color: "amber",
                  delay: 0.2
                },
                {
                  title: "Eco-Friendly Banking",
                  description: "Track your carbon footprint from purchases and contribute to sustainability projects.",
                  icon: <Leaf className="h-6 w-6" />,
                  color: "green",
                  delay: 0.3
                },
                {
                  title: "Goal Tracking",
                  description: "Set financial targets and track your progress with visual dashboards and milestones.",
                  icon: <Target className="h-6 w-6" />,
                  color: "blue",
                  delay: 0.4
                },
                {
                  title: "Rewards Program",
                  description: "Earn points on every transaction and redeem them for cashback, discounts, or exclusive perks.",
                  icon: <Gift className="h-6 w-6" />,
                  color: "purple",
                  delay: 0.5
                }
              ].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: feature.delay }}
                  whileHover={{ y: -5, transition: { duration: 0.2 } }}
                >
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-shadow dark:bg-gray-800">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className={`h-12 w-12 bg-${feature.color}-100 dark:bg-${feature.color}-900/30 rounded-full flex items-center justify-center mb-4 text-${feature.color}-500`}>
                        {feature.icon}
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{feature.title}</h3>
                      <p className="text-gray-500 dark:text-gray-400 grow">
                        {feature.description}
                      </p>
                      <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                        <Link href="/auth?tab=signup">
                          <Button variant="ghost" className="text-primary-600 dark:text-primary-400 p-0 hover:bg-transparent hover:text-primary-700 dark:hover:text-primary-300">
                            Learn more <ArrowRight className="ml-1 h-4 w-4" />
                          </Button>
                        </Link>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="py-24 bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <motion.div 
              className="text-center max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="inline-block rounded-full bg-secondary-100 dark:bg-secondary-900/30 px-3 py-1 text-sm font-medium text-secondary-800 dark:text-secondary-300 mb-4">
                Testimonials
              </div>
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Loved by Customers Worldwide
              </h2>
              <p className="mt-4 text-xl text-gray-500 dark:text-gray-400">
                See what our users have to say about their experience with Nivalus Banking.
              </p>
            </motion.div>

            <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
              {[
                {
                  name: "Sarah Johnson",
                  title: "Small Business Owner",
                  quote: "Nivalus Banking has completely transformed how I manage my business finances. The transaction tracking and reports have saved me hours of work every month.",
                  image: "https://randomuser.me/api/portraits/women/32.jpg",
                  delay: 0
                },
                {
                  name: "David Chen",
                  title: "Tech Professional",
                  quote: "The security features give me peace of mind, and the instant transfers are a game-changer. Best banking experience I've ever had!",
                  image: "https://randomuser.me/api/portraits/men/67.jpg",
                  delay: 0.1
                },
                {
                  name: "Maria Rodriguez",
                  title: "Financial Analyst",
                  quote: "I've used many banking apps before, but none compare to the clean interface and powerful features of Nivalus. The budgeting tools are exceptional.",
                  image: "https://randomuser.me/api/portraits/women/44.jpg",
                  delay: 0.2
                }
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: testimonial.delay }}
                >
                  <Card className="h-full shadow-lg border-0 dark:bg-gray-800 overflow-visible">
                    <CardContent className="p-6 h-full flex flex-col relative">
                      <div className="absolute -top-8 left-6">
                        <div className="w-16 h-16 rounded-full border-4 border-white dark:border-gray-800 overflow-hidden shadow-lg">
                          <img 
                            src={testimonial.image} 
                            alt={testimonial.name} 
                            className="w-full h-full object-cover" 
                          />
                        </div>
                      </div>
                      <div className="pt-8 pb-4">
                        <p className="text-gray-700 dark:text-gray-300 italic">
                          "{testimonial.quote}"
                        </p>
                      </div>
                      <div className="mt-auto pt-4 border-t border-gray-100 dark:border-gray-700">
                        <p className="font-semibold text-gray-900 dark:text-white">{testimonial.name}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.title}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-primary-50 dark:bg-gray-800 relative overflow-hidden">
          <motion.div 
            className="absolute -right-20 -top-20 w-80 h-80 bg-primary-100 dark:bg-primary-900/20 rounded-full"
            animate={{ 
              scale: [1, 1.1, 1],
              rotate: [0, 5, 0],
            }}
            transition={{ 
              duration: 10,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />
          <motion.div 
            className="absolute -left-20 -bottom-20 w-96 h-96 bg-secondary-100 dark:bg-secondary-900/20 rounded-full"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, -5, 0],
            }}
            transition={{ 
              duration: 12,
              repeat: Infinity,
              repeatType: "reverse"
            }}
          />

          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <motion.div 
              className="text-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 dark:text-white tracking-tight">
                Ready to Transform Your Banking Experience?
              </h2>
              <p className="mt-4 text-xl text-gray-600 dark:text-gray-300">
                Join thousands of satisfied customers who have switched to Nivalus Banking.
              </p>
              <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/auth?tab=signup">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button size="lg" className="rounded-full shadow-lg shadow-primary-500/20 px-8 w-full sm:w-auto">
                      Create Account <ArrowRight className="ml-2 w-5 h-5" />
                    </Button>
                  </motion.div>
                </Link>
                <Link href="/contact">
                  <motion.div 
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Button variant="outline" size="lg" className="rounded-full px-8 w-full sm:w-auto">
                      Contact Sales
                    </Button>
                  </motion.div>
                </Link>
              </div>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
