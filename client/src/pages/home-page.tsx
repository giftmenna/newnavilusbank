import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";
import Footer from "@/components/layout/footer";
import { motion } from "framer-motion";
import { ArrowRight, CreditCard, DollarSign, Shield, Leaf, ChevronDown, Target, BarChart, Gift, Sparkles } from "lucide-react";

export default function HomePage() {
  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-grow">
        {/* Animated Welcome Section */}
        <section className="relative h-screen flex items-center justify-center overflow-hidden text-white">
          {/* Background with overlay */}
          <div className="absolute inset-0 z-0">
            <div className="absolute inset-0 bg-gradient-to-b from-primary-800/95 to-gray-900/95" />
            <div 
              className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1617842933071-e0082b5905ce?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80')] bg-cover bg-center mix-blend-overlay dark:mix-blend-soft-light"
              style={{ backgroundPosition: 'center 30%' }}
            />
          </div>
          
          {/* Content */}
          <motion.div 
            className="relative z-10 text-center max-w-4xl px-4 sm:px-6 py-24"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white/10 backdrop-blur-sm">
                <Sparkles className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            
            <motion.h1 
              className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              Welcome to <span className="text-primary-300">Nivalus</span>
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-white/80 max-w-2xl mx-auto mb-10"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Redefining your financial experience with cutting-edge technology and personalized solutions.
            </motion.p>
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Link href="#discover">
                <Button 
                  size="lg" 
                  className="rounded-full bg-white text-primary-900 hover:bg-white/90 px-8"
                >
                  Discover More
                </Button>
              </Link>
            </motion.div>
          </motion.div>
          
          {/* Scroll indicator */}
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-10">
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ 
                duration: 1.5, 
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            >
              <Link href="#discover">
                <Button variant="ghost" size="icon" className="rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 text-white">
                  <ChevronDown className="h-5 w-5" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </section>
        
        {/* Hero Section with App Demo */}
        <section id="discover" className="relative bg-gradient-to-b from-primary-50 to-white dark:from-gray-900 dark:to-gray-800 overflow-hidden">
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
                        <p className="text-sm text-gray-500 dark:text-gray-400">Live Forex Rates</p>
                        <h3 className="text-xl font-bold text-gray-900 dark:text-white">Major Currencies</h3>
                      </div>
                      <div className="w-12 h-12 rounded-full bg-gradient-to-r from-primary-500 to-secondary-500 flex items-center justify-center">
                        <DollarSign className="text-white" />
                      </div>
                    </div>
                    
                    <div className="space-y-4">
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400 font-bold">
                              €
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">EUR/USD</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Updated 5 min ago</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900 dark:text-white font-medium">1.0824</p>
                            <div className="flex items-center justify-end">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mr-1">Buy: 1.0815</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Sell: 1.0833</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-yellow-100 dark:bg-yellow-900/30 flex items-center justify-center text-yellow-600 dark:text-yellow-400 font-bold">
                              £
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">GBP/USD</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Updated 5 min ago</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900 dark:text-white font-medium">1.2635</p>
                            <div className="flex items-center justify-end">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mr-1">Buy: 1.2624</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Sell: 1.2646</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="bg-gray-50 dark:bg-gray-800 rounded-xl p-4">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center text-green-600 dark:text-green-400 font-bold">
                              ¥
                            </div>
                            <div className="ml-3">
                              <p className="text-sm font-medium text-gray-900 dark:text-white">USD/JPY</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Updated 5 min ago</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-gray-900 dark:text-white font-medium">151.42</p>
                            <div className="flex items-center justify-end">
                              <p className="text-xs text-gray-500 dark:text-gray-400 mr-1">Buy: 151.32</p>
                              <p className="text-xs text-gray-500 dark:text-gray-400">Sell: 151.52</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-8">
                      <Button variant="outline" className="w-full rounded-xl" size="lg">
                        View All Currency Rates
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
                  quote: "Nivalus Banking has completely transformed how I manage my business finances. The transaction tracking and budgeting tools have saved me hours each week.",
                  image: "1",
                  delay: 0
                },
                {
                  name: "Michael Chen",
                  title: "Freelance Designer",
                  quote: "As someone who's always on the go, the mobile app is fantastic. Instant transfers and real-time notifications keep me in control of my finances anywhere.",
                  image: "2",
                  delay: 0.1
                },
                {
                  name: "Ava Williams",
                  title: "Environmental Activist",
                  quote: "I love how Nivalus lets me track my carbon footprint and contribute to environmental projects. Banking with purpose makes all the difference.",
                  image: "3",
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
                  <Card className="h-full border-0 shadow-lg dark:bg-gray-800">
                    <CardContent className="p-6 h-full flex flex-col">
                      <div className="flex items-center mb-4">
                        <div className={`w-12 h-12 rounded-full flex items-center justify-center bg-primary-${parseInt(testimonial.image) * 100} text-white font-bold`}>
                          {testimonial.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <h4 className="text-base font-semibold text-gray-900 dark:text-white">{testimonial.name}</h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">{testimonial.title}</p>
                        </div>
                      </div>
                      <p className="text-gray-600 dark:text-gray-300 italic">
                        "{testimonial.quote}"
                      </p>
                      <div className="mt-4 flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <motion.svg
                            key={star}
                            initial={{ opacity: 0, scale: 0.5 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: testimonial.delay + star * 0.1 }}
                            className="w-5 h-5 text-yellow-400 fill-current"
                            viewBox="0 0 20 20"
                          >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                          </motion.svg>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-primary-900 text-white dark:bg-primary-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-12">
              <motion.div 
                className="max-w-2xl"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight leading-tight">
                  Ready to Transform Your <br />Banking Experience?
                </h2>
                <p className="mt-6 text-xl text-primary-100">
                  Join thousands of satisfied customers who have already made the switch to smarter, more intuitive banking.
                </p>
                <div className="mt-10 flex flex-wrap gap-4">
                  <Link href="/auth?tab=signup">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button size="lg" className="rounded-full bg-white text-primary-900 hover:bg-white/90 px-8">
                        Open an Account <ArrowRight className="ml-2 w-5 h-5" />
                      </Button>
                    </motion.div>
                  </Link>
                  <Link href="/contact">
                    <motion.div 
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button variant="outline" size="lg" className="rounded-full border-white text-white hover:bg-white/10 px-8">
                        Contact Us
                      </Button>
                    </motion.div>
                  </Link>
                </div>
              </motion.div>
              
              <motion.div 
                className="relative"
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <div className="relative bg-primary-800/50 backdrop-blur-sm rounded-2xl p-8 border border-primary-700">
                  <div className="absolute -top-4 -right-4 w-16 h-16 bg-primary-500/20 rounded-full" />
                  <div className="absolute -bottom-4 -left-4 w-20 h-20 bg-primary-500/20 rounded-full" />
                  
                  <h3 className="text-2xl font-bold mb-4">Why Our Customers Love Us</h3>
                  <ul className="space-y-4">
                    {[
                      "Intuitive, easy-to-use platform",
                      "24/7 customer support",
                      "Industry-leading security",
                      "Personalized financial insights",
                      "Zero fee account options"
                    ].map((item, i) => (
                      <motion.li 
                        key={i}
                        className="flex items-center gap-3"
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: i * 0.1 }}
                      >
                        <div className="h-6 w-6 rounded-full bg-primary-500/30 flex items-center justify-center">
                          <svg className="h-4 w-4 text-primary-200" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="20 6 9 17 4 12"></polyline>
                          </svg>
                        </div>
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
}